import express from "express";
import cors from "cors";
import path from "path";
import morgan from "morgan";
import api from "./routes/api";
import helmet from "helmet";
import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import dotenv from "dotenv";
dotenv.config();

const AUTH_CONFIG = {
  callbackURL: "/auth/google/callback",
  clientID: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
};

const verifyCallback = (
  accessToken: string,
  refreshToken: string,
  profile: passport.Profile,
  done: (error: any, user?: any) => void
) => {
  console.log(profile);
  done(null, profile);
};

passport.use(new Strategy(AUTH_CONFIG, verifyCallback));

const app = express();

app.use(helmet());
app.use(passport.initialize());

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(morgan("short"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    res.redirect("/");
  }
);
app.get("/auth/logout", (req, res) => {});

app.use("/v1/", api);
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

export default app;
