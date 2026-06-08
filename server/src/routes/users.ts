import express from "express";
import { z } from "zod";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";
import { validateBody } from "../middleware/validation.js";

const router = express.Router();

const updateProfileSchema = z.object({
  role: z.enum(["SEEKER", "TALENT"]).optional(),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional().nullable(),
  title: z.string().max(100, "Title cannot exceed 100 characters").optional().nullable(),
  location: z.string().max(100, "Location cannot exceed 100 characters").optional().nullable(),
  hourlyRate: z.union([
    z.number().nonnegative(),
    z.string().regex(/^\d+(\.\d+)?$/).transform(Number),
    z.string().length(0).transform(() => null)
  ]).optional().nullable(),
  skills: z.array(z.string().min(1).max(30)).optional(),
});

// Get Current User Route
router.get("/api/me", requireAuth, (req: AuthenticatedRequest, res) => {
  res.json({ user: req.user });
});

// Update User Profile Route
router.put("/api/users/profile", requireAuth, validateBody(updateProfileSchema), async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user.id;
    const { role, bio, title, location, hourlyRate, skills } = req.body;

    // Prepare tags if skills is provided
    let skillsUpdate = undefined;
    if (Array.isArray(skills)) {
      const tagConnections = await Promise.all(
        skills.map(async (skillName: string) => {
          const formattedName = skillName.trim();
          const tag = await prisma.tag.upsert({
            where: { name: formattedName },
            update: {},
            create: { name: formattedName },
          });
          return { id: tag.id };
        })
      );

      skillsUpdate = {
        set: tagConnections, // Clears previous skills and sets new ones
      };
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role,
        bio,
        title,
        location,
        hourlyRate: hourlyRate !== undefined ? (hourlyRate === null ? null : Number(hourlyRate)) : undefined,
        onboarded: true, // Mark user as onboarded
        ...(skillsUpdate && { skills: skillsUpdate }),
      },
      include: {
        skills: true,
      },
    });

    res.json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Contacts Route (potential people to message)
router.get("/api/users/contacts", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const oppositeRole = req.user.role === "SEEKER" ? "TALENT" : "SEEKER";
    const contacts = await prisma.user.findMany({
      where: { role: oppositeRole },
      select: { id: true, name: true, avatar: true, role: true, title: true }
    });
    res.json({ contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get All Talents Route — powers the SEEKER discover/home page
router.get("/api/talents", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { search, skill } = req.query;

    const talents = await prisma.user.findMany({
      where: {
        role: "TALENT",
        onboarded: true,
        // Filter by name or title if search query provided
        ...(search && {
          OR: [
            { name: { contains: String(search), mode: "insensitive" } },
            { title: { contains: String(search), mode: "insensitive" } },
          ],
        }),
        // Filter by skill tag if provided
        ...(skill && skill !== "All" && {
          skills: {
            some: { name: { equals: String(skill), mode: "insensitive" } },
          },
        }),
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        title: true,
        bio: true,
        location: true,
        hourlyRate: true,
        skills: { select: { id: true, name: true } },
        _count: { select: { projects: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ talents });
  } catch (error) {
    console.error("Error fetching talents:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
