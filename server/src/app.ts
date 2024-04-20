import express from "express";
import planetsRouter from "./routes/planets/planets.router";
import cors from "cors"

const app = express();

app.use(cors({
  origin: "http://localhost:3000"
}))
app.use(express.json())

app.use(planetsRouter)

module.exports = app;
