import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.js";
import { isS3Configured, uploadToS3 } from "../lib/s3.js";

const router = express.Router();

// Memory storage for direct buffer upload to S3 or local fallback
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!") as any, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Upload Single File Route
router.post("/api/upload", requireAuth, (req: AuthenticatedRequest, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `Multer upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Please select an image file to upload" });
    }

    try {
      if (isS3Configured()) {
        // Upload to S3 (Supabase S3 Gateway) using official @aws-sdk/client-s3
        const fileUrl = await uploadToS3({
          buffer: req.file.buffer,
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
        });

        console.log(`[S3 Upload] Successfully uploaded ${req.file.originalname} -> ${fileUrl}`);
        return res.status(200).json({ url: fileUrl, storage: "s3" });
      } else {
        // Fallback: Save buffer to local uploads/ directory
        const uploadsDir = path.join(process.cwd(), "uploads");
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(req.file.originalname);
        const filename = `${req.file.fieldname}-${uniqueSuffix}${ext}`;
        const filePath = path.join(uploadsDir, filename);

        await fs.promises.writeFile(filePath, req.file.buffer);

        const host = req.get("host") || "localhost:3000";
        const protocol = req.protocol || "http";
        const fileUrl = `${protocol}://${host}/uploads/${filename}`;

        console.log(`[Local Upload Fallback] S3 not configured in .env. Saved to ${filePath}`);
        return res.status(200).json({
          url: fileUrl,
          storage: "local",
          message: "Saved locally. Add S3 credentials to .env to upload directly to Supabase S3 cloud storage.",
        });
      }
    } catch (uploadError: any) {
      console.error("Upload error:", uploadError);
      return res.status(500).json({ message: uploadError.message || "Failed to upload file" });
    }
  });
});

export default router;
