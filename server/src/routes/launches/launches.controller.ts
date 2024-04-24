import { Request, Response } from "express";
import {
  getAllLaunches,
  scheduleOneLaunch,
  abortOneLaunch,
  launchExists,
  Launch,
} from "../../models/launches.model";

function httpGetAllLaunches(req: Request, res: Response) {
  try {
    return res.status(200).json(getAllLaunches());
  } catch (error) {
    return res.status(500).json({ error: "Cannot get launches" });
  }
}

async function httpPostOneLaunch(req: Request, res: Response) {
  const launch: Launch = req.body;

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

  await scheduleOneLaunch(launch);
  return res.status(201).json(launch);
}

function httpAbortOneLaunch(req: Request, res: Response) {
  const flightNumber = +req.params.id; // +e === Number(e)
  if (!flightNumber) {
    return res.status(400).json({ error: "Missing ID for launch!" });
  }
  if (typeof flightNumber !== "number") {
    return res.status(400).json({ error: "Missing correct ID format!" });
  }
  if(!launchExists(flightNumber)){
    return res.status(404).json({ error: "The launch does not exist!" })
  }

  const abortedLaunch = abortOneLaunch(flightNumber);
  return res.status(200).json(abortedLaunch)
}

export { httpGetAllLaunches, httpPostOneLaunch, httpAbortOneLaunch };
