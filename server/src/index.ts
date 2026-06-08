import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

// Load environment variables
dotenv.config({ override: true });

// Import modular routers
import authRouter from "./routes/auth.js";
import userRouter from "./routes/users.js";
import projectRouter from "./routes/projects.js";
import messageRouter from "./routes/messages.js";
import uploadRouter from "./routes/upload.js";
import jobRouter from "./routes/jobs.js";

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// --- Middleware ---
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true, // Allow cookies
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Serve static uploaded files
app.use("/uploads", express.static("uploads"));

// --- Register Modular Routers ---
app.use(authRouter);
app.use(userRouter);
app.use(messageRouter);
app.use(uploadRouter);
app.use("/api/projects", projectRouter);
app.use("/api/jobs", jobRouter);

// --- Wrap Server and Initialize Socket.io ---
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
  },
});

// Expose io instance to express app
app.set("io", io);

// Socket connections handling
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Listen for user joining their custom private room
  socket.on("join", (userId: string) => {
    if (userId) {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`Server starting up on port ${PORT}...`);
  console.log(`Server running on http://localhost:${PORT} - Database Connected & Sockets Enabled!`);
});

