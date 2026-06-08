import express from "express";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";

const router = express.Router();

// Get Conversations Route
router.get("/api/conversations", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user.id;

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { seekerId: userId },
          { talentId: userId },
        ],
      },
      include: {
        seeker: {
          select: { id: true, name: true, avatar: true },
        },
        talent: {
          select: { id: true, name: true, avatar: true },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const formattedConversations = conversations.map((c) => {
      const otherUser = c.seekerId === userId ? c.talent : c.seeker;
      const lastMessage = c.messages[0];
      return {
        id: c.id,
        otherUser,
        lastMessage: lastMessage ? lastMessage.content : "No messages yet",
        timestamp: lastMessage ? lastMessage.createdAt : c.updatedAt,
      };
    });

    res.json({ conversations: formattedConversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create Conversation Route
router.post("/api/conversations", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { recipientId } = req.body;

    if (!recipientId) {
      return res.status(400).json({ message: "Recipient ID is required" });
    }

    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
    });

    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    let seekerId: string;
    let talentId: string;

    if (req.user.role === "SEEKER") {
      seekerId = req.user.id;
      talentId = recipientId;
    } else {
      seekerId = recipientId;
      talentId = req.user.id;
    }

    // Attempt to find or create the conversation
    let conversation = await prisma.conversation.findUnique({
      where: {
        seekerId_talentId: { seekerId, talentId },
      },
      include: {
        seeker: { select: { id: true, name: true, avatar: true } },
        talent: { select: { id: true, name: true, avatar: true } },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { seekerId, talentId },
        include: {
          seeker: { select: { id: true, name: true, avatar: true } },
          talent: { select: { id: true, name: true, avatar: true } },
        },
      });
    }

    const otherUser = conversation.seekerId === req.user.id ? conversation.talent : conversation.seeker;

    res.status(201).json({
      conversation: {
        id: conversation.id,
        otherUser,
        lastMessage: "No messages yet",
        timestamp: conversation.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Messages Route
router.get("/api/conversations/:id/messages", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const conversationId = req.params.id;

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (conversation.seekerId !== req.user.id && conversation.talentId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to view these messages" });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });

    res.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Send Message Route
router.post("/api/conversations/:id/messages", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const conversationId = req.params.id;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Message content is required" });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (conversation.seekerId !== req.user.id && conversation.talentId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to send messages in this conversation" });
    }

    const message = await prisma.message.create({
      data: {
        content,
        conversationId,
        senderId: req.user.id,
      },
    });

    // Update conversation updatedAt timestamp to float it to the top
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    res.status(201).json({ message });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
