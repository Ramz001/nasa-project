import express from "express";
import planetsRouter from "./routes/planets/planets.router";
import launchesRouter from "./routes/launches/launches.router";
import cors from "cors";
import path from "path";
import morgan from "morgan";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public", "build")));

app.use("/planets", planetsRouter);
app.use("/launches", launchesRouter);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "build", "index.html"));
});

module.exports = app;
