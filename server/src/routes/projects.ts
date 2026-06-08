import express from "express";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";

const router = express.Router();

// Create Project Route
router.post("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { title, description, mediaUrl, tags } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    let tagConnections = undefined;
    if (Array.isArray(tags)) {
      const tagRecords = await Promise.all(
        tags.map(async (tagName: string) => {
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

    const project = await prisma.project.create({
      data: {
        title,
        description,
        mediaUrl,
        userId: req.user.id,
        ...(tagConnections && { tags: tagConnections }),
      },
      include: {
        tags: true,
        user: true,
      },
    });

    res.status(201).json({ project });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Projects Route (with optional filters)
router.get("/", async (req, res) => {
  try {
    const { userId, tag } = req.query;
    const where: any = {};

    if (userId) {
      where.userId = String(userId);
    }

    if (tag) {
      where.tags = {
        some: {
          name: String(tag),
        },
      };
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        tags: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Single Project Route
router.get("/:id", async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        tags: true,
        user: true,
      },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ project });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update Project Route
router.put("/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const projectId = req.params.id;
    const { title, description, mediaUrl, tags } = req.body;

    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (existingProject.userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to update this project" });
    }

    let tagUpdate = undefined;
    if (Array.isArray(tags)) {
      const tagRecords = await Promise.all(
        tags.map(async (tagName: string) => {
          const formattedName = tagName.trim();
          const tag = await prisma.tag.upsert({
            where: { name: formattedName },
            update: {},
            create: { name: formattedName },
          });
          return { id: tag.id };
        })
      );
      tagUpdate = {
        set: tagRecords, // Replace old tags with new ones
      };
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        title,
        description,
        mediaUrl,
        ...(tagUpdate && { tags: tagUpdate }),
      },
      include: {
        tags: true,
        user: true,
      },
    });

    res.json({ project: updatedProject });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete Project Route
router.delete("/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const projectId = req.params.id;

    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (existingProject.userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this project" });
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
