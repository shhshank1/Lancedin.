import express from "express";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";

const router = express.Router();

// Get Current User Route
router.get("/api/me", requireAuth, (req: AuthenticatedRequest, res) => {
  res.json({ user: req.user });
});

// Update User Profile Route
router.put("/api/users/profile", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user.id;
    const { role, bio, title, location, hourlyRate, skills } = req.body;

    // Validate role
    if (role && role !== "SEEKER" && role !== "TALENT") {
      return res.status(400).json({ message: "Invalid role selected" });
    }

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

export default router;
