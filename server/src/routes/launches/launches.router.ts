import express from "express";
import { httpGetAllLaunches, httpPostOneLaunch, httpAbortOneLaunch } from "./launches.controller";

const launchesRouter = express.Router();

launchesRouter.get("/", httpGetAllLaunches);
launchesRouter.post("/", httpPostOneLaunch)
launchesRouter.delete("/:id", httpAbortOneLaunch)

export default launchesRouter;
