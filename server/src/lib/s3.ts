import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const {
  S3_ENDPOINT,
  S3_REGION = "us-east-1",
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
  S3_BUCKET_NAME = "lancedin-media",
  S3_PUBLIC_URL_PREFIX,
} = process.env;

/**
 * Checks if S3 environment variables are fully configured.
 */
export function isS3Configured(): boolean {
  return Boolean(
    S3_ENDPOINT &&
      S3_ACCESS_KEY_ID &&
      S3_SECRET_ACCESS_KEY &&
      !S3_ENDPOINT.includes("your-project-ref")
  );
}

// Create lazy/singleton S3 client instance
let s3ClientInstance: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3ClientInstance) {
    s3ClientInstance = new S3Client({
      endpoint: S3_ENDPOINT,
      region: S3_REGION,
      credentials: {
        accessKeyId: S3_ACCESS_KEY_ID || "",
        secretAccessKey: S3_SECRET_ACCESS_KEY || "",
      },
      forcePathStyle: true, // Needed for Supabase and standard S3-compatible gateways
    });
  }
  return s3ClientInstance;
}

export interface UploadOptions {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
}

/**
 * Uploads a file buffer to S3-compatible storage and returns the public file URL.
 */
export async function uploadToS3({ buffer, originalName, mimeType }: UploadOptions): Promise<string> {
  if (!isS3Configured()) {
    throw new Error("S3 storage is not fully configured in environment variables.");
  }

  const s3 = getS3Client();
  const ext = path.extname(originalName);
  const sanitizeName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
  const key = `uploads/${Date.now()}-${Math.round(Math.random() * 1e9)}-${sanitizeName}${ext}`;

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
  });

  await s3.send(command);

  if (S3_PUBLIC_URL_PREFIX && !S3_PUBLIC_URL_PREFIX.includes("your-project-ref")) {
    const cleanPrefix = S3_PUBLIC_URL_PREFIX.endsWith("/")
      ? S3_PUBLIC_URL_PREFIX.slice(0, -1)
      : S3_PUBLIC_URL_PREFIX;
    return `${cleanPrefix}/${key}`;
  }

  // Fallback construction for Supabase public object URL
  if (S3_ENDPOINT) {
    const baseUrl = S3_ENDPOINT.replace(/\/storage\/v1\/s3\/?$/, "");
    return `${baseUrl}/storage/v1/object/public/${S3_BUCKET_NAME}/${key}`;
  }

  return key;
}
