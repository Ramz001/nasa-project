import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import https from "https";
import path from "path";
import App from "./app";
import { loadPlanetsData } from "./models/planets.model";
import { mongoConnect } from "./services/mongo";
import { loadLaunchesData } from "./models/launches.model";

const PORT = process.env.PORT || 4000;

const server = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "..", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "..", "cert.pem")),
  },
  App
);

async function startServer() {
  try {
    await mongoConnect();
    await loadPlanetsData();
    await loadLaunchesData();

    server.listen(PORT, () => {
      console.log(`Listening on port ${PORT}...`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

export default server;
