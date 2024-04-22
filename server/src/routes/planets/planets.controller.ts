import { Request, Response } from "express";
import { getHabitablePlanets } from "../../models/planets.model";

function httpGetAllPlanets(req: Request, res: Response) {
  return res.status(200).json(getHabitablePlanets());
}

export { httpGetAllPlanets };
