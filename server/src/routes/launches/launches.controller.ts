import { Request, Response } from "express";
import {
  getAllLaunches,
  postOneLaunch,
  Launch,
} from "../../models/launches.model";

function httpGetAllLaunches(req: Request, res: Response) {
  try {
    return res.status(200).json(getAllLaunches());
  } catch (error) {
    return res.status(500).json({ error: "Cannot get launches" });
  }
}

function httpPostOneLaunch(req: Request, res: Response) {
  const launch: Launch = req.body;

  if (!launch.target || !launch.mission || !launch.launchDate || !launch.rocket)
    return res
      .status(400)
      .json({ error: "Missing required lauch properties!" });

  launch.launchDate = new Date(launch.launchDate);
  const currentYear = new Date().getFullYear();
  console.log(launch.launchDate.getFullYear(), currentYear);

  if (isNaN(Number(launch.launchDate))) {
    return res.status(400).json({ error: "Invalid launch date!" });
  }
  if (currentYear >= launch.launchDate.getFullYear()) {
    return res.status(400).json({
      error: "The launch date cannot be in the past!",
    });
  }

  postOneLaunch(launch);
  return res.status(201).json(launch);
}

export { httpGetAllLaunches, httpPostOneLaunch };
