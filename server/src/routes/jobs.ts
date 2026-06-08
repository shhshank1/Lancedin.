import express from "express";
import { z } from "zod";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";
import { validateBody } from "../middleware/validation.js";

const createJobSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
  description: z.string().min(1, "Description is required").max(2000, "Description must be 2000 characters or less"),
  company: z.string().max(100, "Company name must be 100 characters or less").optional().nullable(),
  location: z.string().max(100, "Location must be 100 characters or less").optional().nullable(),
  budget: z.string().min(1, "Budget is required").max(50, "Budget must be 50 characters or less"),
  deadline: z.string().max(50, "Deadline must be 50 characters or less").optional().nullable(),
  skills: z.array(z.string().min(1).max(30)).optional(),
});

const router = express.Router();

// Create Job Listing Route
router.post("/", requireAuth, validateBody(createJobSchema), async (req: AuthenticatedRequest, res) => {
  try {
    if (req.user.role !== "SEEKER") {
      return res.status(403).json({ message: "Only clients (seekers) can post job listings" });
    }

    const { title, description, company, location, budget, deadline, skills } = req.body;

    let tagConnections = undefined;
    if (Array.isArray(skills)) {
      const tagRecords = await Promise.all(
        skills.map(async (tagName: string) => {
          const formattedName = tagName.trim();
          const tag = await prisma.tag.upsert({
            where: { name: formattedName },
            update: {},
            create: { name: formattedName },
          });
          return { id: tag.id };
        })
      );
      tagConnections = {
        connect: tagRecords,
      };
    }

    const job = await prisma.job.create({
      data: {
        title,
        description,
        company: company || req.user.name,
        location: location || "Remote",
        budget,
        deadline,
        seekerId: req.user.id,
        ...(tagConnections && { tags: tagConnections }),
      },
      include: {
        tags: true,
        seeker: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    res.status(201).json({ job });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get All Jobs Route
router.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { search, skill } = req.query;

    const jobs = await prisma.job.findMany({
      where: {
        ...(search && {
          OR: [
            { title: { contains: String(search), mode: "insensitive" } },
            { description: { contains: String(search), mode: "insensitive" } },
            { company: { contains: String(search), mode: "insensitive" } },
          ],
        }),
        ...(skill && skill !== "All" && {
          tags: {
            some: { name: { equals: String(skill), mode: "insensitive" } },
          },
        }),
      },
      include: {
        tags: true,
        seeker: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete Job Listing Route
router.delete("/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const jobId = req.params.id;

    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!existingJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (existingJob.seekerId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this job listing" });
    }

    await prisma.job.delete({
      where: { id: jobId },
    });

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
