const App = require("./app");
const http = require("http");
import { loadPlanetsData } from './models/planets.model'

const PORT = process.env.PORT || 4000;

const server = http.createServer(App);

async function startServer() {
  await loadPlanetsData()

  server.listen(PORT, () => {
    console.log("Listening on port: " + PORT);  
  });
}
startServer()