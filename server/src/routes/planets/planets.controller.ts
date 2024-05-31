import { Request, Response } from "express";
import { getHabitablePlanets } from "../../models/planets.model";

async function httpGetAllPlanets(req: Request, res: Response) {
  const planets = await getHabitablePlanets()
  console.log(planets)
  return res.status(200).json(planets);
}

export { httpGetAllPlanets };
