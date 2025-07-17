require("dotenv").config();
import fs from "fs";
import https from "https";
import path from "path";
import App from "./app";
import { loadPlanetsData } from "./models/planets.model";
import { loadLaunchesData } from "./models/launches.model";
import { mongoConnect, mongoDisconnect } from "./services/mongo";

const PORT = process.env.PORT || 4000;
const CERT_PATH = path.join(__dirname, "..", "cert.pem");
const KEY_PATH = path.join(__dirname, "..", "key.pem");

// Check for cert files
if (!fs.existsSync(CERT_PATH) || !fs.existsSync(KEY_PATH)) {
  console.error("Missing SSL certificate or key file.");
  process.exit(1);
}

const server = https.createServer(
  {
    key: fs.readFileSync(KEY_PATH),
    cert: fs.readFileSync(CERT_PATH),
  },
  App
);

async function startServer() {
  try {
    if (!process.env.MONGODB_SECRET) {
      throw new Error("Missing MONGODB_URI in environment variables");
    }

    await mongoConnect();
    await loadPlanetsData();
    await loadLaunchesData();

    server.listen(PORT, () => {
      console.log(`🚀 Server running at https://localhost:${PORT}`);
    });

    // Optional: graceful shutdown
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

async function shutdown() {
  console.log("🛑 Shutting down server...");
  await mongoDisconnect();
  process.exit(0);
}

if (require.main === module) {
  startServer();
}

export default server;
