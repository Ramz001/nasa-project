const App = require("./app");
const http = require("http");

const PORT = process.env.PORT || 4000;

const server = http.createServer(App);

server.listen(PORT, () => {
  console.log("Listening on port: " + PORT);  
});
