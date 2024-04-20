const App = require("./app");
const http = require("http");
import { getPlanetsData } from './models/planets.model'

const PORT = process.env.PORT || 4000;

const server = http.createServer(App);

async function startServer() {
  await getPlanetsData()

  server.listen(PORT, () => {
    console.log("Listening on port: " + PORT);  
  });
}
startServer()