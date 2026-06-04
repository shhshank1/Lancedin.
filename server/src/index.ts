import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config({ override: true });

// Prisma 7 requires a driver adapter. We use an explicit pg.Pool for maximum stability.
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey_change_in_production";

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

// --- Passport Configuration ---
// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // 1. Check if the user already exists in our Postgres database
          let user = await prisma.user.findUnique({
            where: { providerId: profile.id },
          });
          // 2. If they don't exist, create a new row in the database
          if (!user) {
            user = await prisma.user.create({
              data: {
                provider: "google",
                providerId: profile.id,
                name: profile.displayName || "Unknown",
                email: profile.emails?.[0].value,
                avatar: profile.photos?.[0].value,
                // role defaults to "SEEKER" automatically because of our schema!
              },
            });
          }
          // 3. Pass the user object to Passport
          return done(null, user);
        } catch (error) {
          console.error("Database error during authentication:", error);
          return done(error, undefined);
        }
      }
    )
  );
}

// LinkedIn Strategy
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  passport.use(
    new LinkedInStrategy(
      {
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: "/auth/linkedin/callback",
        scope: ["openid", "profile", "email"], // Modern LinkedIn v2 scopes
        // @ts-ignore
        state: true,
      },
            async (accessToken: any, refreshToken: any, profile: any, done: any) => {
        try {
          let user = await prisma.user.findUnique({
            where: { providerId: profile.id },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                provider: "linkedin",
                providerId: profile.id,
                name: profile.displayName || "Unknown",
                email: profile.emails?.[0]?.value,
                avatar: profile.photos?.[0]?.value,
              },
            });
          }
          return done(null, user);
        } catch (error) {
          console.error("Database error during LinkedIn auth:", error);
          return done(error, undefined);
        }
      }
    )
  )
}
  

// --- Helper Functions ---
const generateToken = (user: any) => {
  return jwt.sign({ id: user.id, name: user.name, email: user.email, avatar: user.avatar }, JWT_SECRET, {
    expiresIn: "1d",
  });
};

const handleOAuthCallback = (req: express.Request, res: express.Response) => {
  if (!req.user) return res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
  
  // Generate JWT token
  const token = generateToken(req.user);

  // Set token in an HTTP-only cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  // Redirect back to frontend
  res.redirect(`${FRONTEND_URL}/`);
};

// --- Routes ---

// Google Auth Routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${FRONTEND_URL}/login` }),
  handleOAuthCallback
);

// LinkedIn Auth Routes
app.get("/auth/linkedin", passport.authenticate("linkedin"));
app.get(
  "/auth/linkedin/callback",
  passport.authenticate("linkedin", { session: false, failureRedirect: `${FRONTEND_URL}/login` }),
  handleOAuthCallback
);

// Get Current User Route
app.get("/api/me", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ user: decoded });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Logout Route
app.post("/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server starting up on port ${PORT}...`);
  console.log(`Server running on http://localhost:${PORT} - Database Connected!`);
});
