import express, { Request, Response, NextFunction } from "express";
import passport from "passport";
import { Strategy, Profile } from "passport-google-oauth20";

const AUTH_CONFIG = {
  callbackURL: "/auth/google/callback",
  clientID: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
};

const verifyCallback = (
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: (error: any, user?: any) => void
) => {
  // In a real application, you would find or create a user in your database.
  // For example:
  // const user = await User.findOrCreate({ where: { googleId: profile.id } });
  // done(null, user);

  console.log("Google profile", profile);
  done(null, profile); // For now, we pass the profile.
};

passport.use(new Strategy(AUTH_CONFIG, verifyCallback));

// Save session to cookie
passport.serializeUser((user: any, done) => {
  // Instead of storing the entire user object, store only the user ID.
  // This makes the session cookie smaller and more secure.
  console.log("serializeUser", user.id);
  done(null, user.id);
});

// Retrieve session from cookie
passport.deserializeUser((id: any, done) => {
  // Fetch the user from the database using the ID stored in the session.
  // For example:
  // const user = await User.findById(id);
  // done(null, user);

  // For this example, we'll just pass a mock user object.
  // In a real app, you would look up the user in a database.
  done(null, { id });
});

const authRouter = express.Router();

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile"] })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect("/");
  }
);
authRouter.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    if (!req.session) return res.redirect("/");

    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie("connect.sid").redirect("/");
    });
  });
});

authRouter.get("/profile", isAuthenticated, (req, res) => {
  // If this route is reached, the user is authenticated.
  // req.user is populated by passport and contains the user's profile.
  res.status(200).json(req.user);
});

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("isAuthenticated", req.user);
  const isLoggedIn = req.user;
  if (!isLoggedIn) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  next();
}

export default authRouter;
