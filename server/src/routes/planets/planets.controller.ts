import { Request, Response } from "express";
import { habitablePlanets } from "../../models/planets.model";

const getAllPlanets = (req: Request, res: Response) => {
  return res.status(200).json(habitablePlanets);
};

export { getAllPlanets };
