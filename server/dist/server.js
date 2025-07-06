"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const planets_model_1 = require("./models/planets.model");
const app_1 = __importDefault(require("./app"));
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os"));
require("dotenv").config();
const mongoose_1 = __importDefault(require("mongoose"));
const PORT = process.env.PORT || 4000;
const numCPUs = os_1.default.cpus().length;
const MONGODB_SECRET = (_a = process.env.MONGODB_SECRET) !== null && _a !== void 0 ? _a : "";
mongoose_1.default.connection.once("open", () => {
    console.log("MongoDB connection ready");
});
mongoose_1.default.connection.on("error", (err) => {
    console.error(err);
});
mongoose_1.default.connect(MONGODB_SECRET);
const server = http_1.default.createServer(app_1.default);
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, planets_model_1.loadPlanetsData)();
        server.listen(PORT, () => {
            console.log("Port: " + PORT + "Process: " + process.pid);
        });
    });
}
if (cluster_1.default.isPrimary) {
    for (let i = 0; i < 2; i++) {
        cluster_1.default.fork();
    }
}
else {
    startServer();
}
