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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHabitablePlanets = exports.loadPlanetsData = void 0;
const { parse } = require("csv-parse");
const fs = require("fs");
const path_1 = __importDefault(require("path"));
const planets_mongo_1 = __importDefault(require("./planets.mongo"));
const isHabitablePlanet = (planet) => {
    return (planet["koi_disposition"] === "CONFIRMED" &&
        planet["koi_insol"] > 0.33 &&
        planet["koi_insol"] < 1.11 &&
        planet["koi_prad"] < 1.6);
};
function loadPlanetsData() {
    return __awaiter(this, void 0, void 0, function* () {
        const filePath = path_1.default.join(__dirname, "..", "..", "data", "kepler_data.csv");
        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(parse({ columns: true, comment: "#" }))
                .on("data", (data) => __awaiter(this, void 0, void 0, function* () {
                if (isHabitablePlanet(data)) {
                    savePlanet(data);
                }
            }))
                .on("end", () => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const habitablePlanetsNum = (_a = (yield getHabitablePlanets())) === null || _a === void 0 ? void 0 : _a.length;
                console.log(habitablePlanetsNum + " habitable planets found!");
                resolve();
            }))
                .on("error", (err) => reject(err));
        });
    });
}
exports.loadPlanetsData = loadPlanetsData;
function savePlanet(planet) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield planets_mongo_1.default.updateOne({ keplerName: planet.kepler_name }, { keplerName: planet.kepler_name }, { upsert: true });
        }
        catch (error) {
            console.log("Error saving planet: " + error);
        }
    });
}
function getHabitablePlanets() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield planets_mongo_1.default.find({}, { "_id": 0, "__v": 0 });
        }
        catch (error) {
            console.log("Error getting planets: " + error);
        }
    });
}
exports.getHabitablePlanets = getHabitablePlanets;
