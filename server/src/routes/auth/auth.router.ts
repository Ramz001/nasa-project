import express from "express";
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
  console.log(profile);
  done(null, profile);
};

passport.use(new Strategy(AUTH_CONFIG, verifyCallback));

// save sessiont to cookie
passport.serializeUser((user, done) => {
  done(null, user);
});
// retrieve session from cookie
passport.deserializeUser((user: Profile, done) => {
  done(null, user);
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
    if (err) {
      return next(err);
    }
    if (!req.session) {
      return res.redirect("/");
    }

    req.session.destroy((err: Error | undefined) => {
      if (err) {
        return next(err);
      }
      res.clearCookie("connect.sid");
      res.redirect("/");
    });
  });
});

export default authRouter;
