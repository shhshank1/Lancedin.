import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import cookieParser from "cookie-parser";

// Load environment variables
dotenv.config({ override: true });

// Import modular routers
import authRouter from "./routes/auth.js";
import userRouter from "./routes/users.js";
import projectRouter from "./routes/projects.js";
import messageRouter from "./routes/messages.js";

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

// --- Register Modular Routers ---
app.use(authRouter);
app.use(userRouter);
app.use(messageRouter);
app.use("/api/projects", projectRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`Server starting up on port ${PORT}...`);
  console.log(`Server running on http://localhost:${PORT} - Database Connected!`);
});
