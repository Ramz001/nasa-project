import http from "http";
import App from "./app";
import { loadPlanetsData } from "./models/planets.model";
import { mongoConnect } from "./services/mongo";

const PORT = process.env.PORT || 4000;

const server = http.createServer(App);

async function startServer() {
  try {
    await mongoConnect();
    await loadPlanetsData();

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
