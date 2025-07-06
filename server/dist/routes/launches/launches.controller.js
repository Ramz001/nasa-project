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
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpAbortOneLaunch = exports.httpPostOneLaunch = exports.httpGetAllLaunches = void 0;
const launches_model_1 = require("../../models/launches.model");
function httpGetAllLaunches(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const launches = yield (0, launches_model_1.getAllLaunches)();
            return res.status(200).json(launches);
        }
        catch (error) {
            return res.status(500).json({ error: "Cannot get launches" });
        }
    });
}
exports.httpGetAllLaunches = httpGetAllLaunches;
function httpPostOneLaunch(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const launch = req.body;
        if (!launch.target || !launch.mission || !launch.launchDate || !launch.rocket)
            return res
                .status(400)
                .json({ error: "Missing required lauch properties!" });
        launch.launchDate = new Date(launch.launchDate);
        const currentYear = new Date().getFullYear();
        if (isNaN(Number(launch.launchDate))) {
            return res.status(400).json({ error: "Invalid launch date!" });
        }
        if (currentYear >= launch.launchDate.getFullYear()) {
            return res.status(400).json({
                error: "The launch date cannot be in the past!",
            });
        }
        yield (0, launches_model_1.scheduleOneLaunch)(launch);
        return res.status(201).json(launch);
    });
}
exports.httpPostOneLaunch = httpPostOneLaunch;
function httpAbortOneLaunch(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const flightNumber = +req.params.id; // +e === Number(e)
        if (!flightNumber) {
            return res.status(400).json({ error: "Missing ID for launch!" });
        }
        if (typeof flightNumber !== "number") {
            return res.status(400).json({ error: "Missing correct ID format!" });
        }
        if (yield !(0, launches_model_1.launchExists)(flightNumber)) {
            return res.status(404).json({ error: "The launch does not exist!" });
        }
        const abortedLaunch = yield (0, launches_model_1.abortOneLaunch)(flightNumber);
        if (!abortedLaunch) {
            return res.status(400).json({ error: "Launch not aborted" });
        }
        return res.status(200).json({ ok: true });
    });
}
exports.httpAbortOneLaunch = httpAbortOneLaunch;
