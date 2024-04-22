import express from "express";
import { httpGetAllLaunches, httpPostOneLaunch } from "./launches.controller";

const launchesRouter = express.Router();

launchesRouter.get("/", httpGetAllLaunches);
launchesRouter.post("/", httpPostOneLaunch)

export default launchesRouter;
