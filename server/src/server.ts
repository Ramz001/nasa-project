import http from "http";
import { loadPlanetsData } from "./models/planets.model";
import App from "./app";
import cluster from "cluster";
import os from "os";
require("dotenv").config();
import mongoose from "mongoose";

const PORT = process.env.PORT || 4000;
const numCPUs = os.cpus().length;

const MONGODB_SECRET = process.env.MONGODB_SECRET ?? "";

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

mongoose.connect(MONGODB_SECRET);

const server = http.createServer(App);

async function startServer() {
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log("Port: " + PORT + "Process: " + process.pid);
  });
}

if (cluster.isPrimary) {
  for (let i = 0; i < 2; i++) {
    cluster.fork();
  }
} else {
  startServer();
}
