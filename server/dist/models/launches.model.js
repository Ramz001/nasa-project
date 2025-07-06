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
exports.launchExists = exports.abortOneLaunch = exports.scheduleOneLaunch = exports.getAllLaunches = void 0;
const launches_mongo_1 = __importDefault(require("./launches.mongo"));
const planets_mongo_1 = __importDefault(require("./planets.mongo"));
const DEFAULT_FLIGHT_NUMBER = 100;
function getAllLaunches() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield launches_mongo_1.default.find({}, { _id: 0, __v: 0 });
        }
        catch (error) {
            console.log("Error getting launches: " + error);
        }
    });
}
exports.getAllLaunches = getAllLaunches;
function scheduleOneLaunch(launch) {
    return __awaiter(this, void 0, void 0, function* () {
        const flightNumber = yield getLatestFlightNumber();
        if (!flightNumber) {
            throw new Error("Flight Number is undefined");
        }
        console.log(flightNumber);
        const newFlightNumber = flightNumber + 1;
        const newLaunch = Object.assign(launch, {
            success: true,
            upcoming: true,
            customers: ["Hourglass", "Nasa"],
            flightNumber: newFlightNumber,
        });
        return yield saveLaunch(newLaunch);
    });
}
exports.scheduleOneLaunch = scheduleOneLaunch;
function launchExists(flightNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield launches_mongo_1.default.findOne({ flightNumber });
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.launchExists = launchExists;
function saveLaunch(launch) {
    return __awaiter(this, void 0, void 0, function* () {
        const planet = yield planets_mongo_1.default.findOne({ keplerName: launch.target });
        if (!planet) {
            throw new Error("No matching planet found");
        }
        yield launches_mongo_1.default.findOneAndUpdate({ flightNumber: launch.flightNumber }, launch, {
            upsert: true,
        });
    });
}
function getLatestFlightNumber() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const latestLaunch = yield launches_mongo_1.default.findOne().sort("-flightNumber");
            if (!latestLaunch) {
                return DEFAULT_FLIGHT_NUMBER;
            }
            return latestLaunch.flightNumber;
        }
        catch (error) {
            console.log(error);
        }
    });
}
function abortOneLaunch(flightNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield launches_mongo_1.default.updateOne({
                flightNumber,
            }, { success: false, upcoming: false });
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.abortOneLaunch = abortOneLaunch;
