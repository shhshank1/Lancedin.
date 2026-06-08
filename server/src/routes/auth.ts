import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey_change_in_production";

// --- Passport Configuration ---
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
          let user = await prisma.user.findUnique({
            where: { providerId: profile.id },
          });
          if (!user) {
            user = await prisma.user.create({
              data: {
                provider: "google",
                providerId: profile.id,
                name: profile.displayName || "Unknown",
                email: profile.emails?.[0].value,
                avatar: profile.photos?.[0].value,
              },
            });
          }
          return done(null, user);
        } catch (error) {
          console.error("Database error during Google authentication:", error);
          return done(error, undefined);
        }
      }
    )
  );
}

if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  passport.use(
    new LinkedInStrategy(
      {
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: "/auth/linkedin/callback",
        scope: ["openid", "profile", "email"],
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
  );
}

const generateToken = (user: any) => {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, avatar: user.avatar },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
};

const handleOAuthCallback = (req: express.Request, res: express.Response) => {
  if (!req.user) return res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
  
  const token = generateToken(req.user);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.redirect(`${FRONTEND_URL}/`);
};

// --- Auth Routes ---
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${FRONTEND_URL}/login` }),
  handleOAuthCallback
);

router.get("/auth/linkedin", passport.authenticate("linkedin"));
router.get(
  "/auth/linkedin/callback",
  passport.authenticate("linkedin", { session: false, failureRedirect: `${FRONTEND_URL}/login` }),
  handleOAuthCallback
);

router.post("/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

export default router;
