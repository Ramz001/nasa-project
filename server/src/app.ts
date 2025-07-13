import express from "express";
import cors from "cors";
import path from "path";
import morgan from "morgan";
import api from "./routes/api";
import helmet from "helmet";
import passport from "passport";
import session from "express-session";
import authRouter from "./routes/auth/auth.router";

const SESSION_SECRET = process.env.SESSION_SECRET || "your_session_secret";

const app = express();

app.use(helmet());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  }) as any
);
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  })
);

app.use(morgan("short"));
app.use(express.json());
// app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/auth", authRouter);

app.use("/v1/", api);
// app.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "..", "public", "index.html"));
// });

export default app;
