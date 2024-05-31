const { parse } = require("csv-parse");
const fs = require("fs");
import path from "path";
import planets from "./planets.mongo";

type Planet = {
  kepid: string;
  kepler_name: string;
  koi_disposition: string;
  koi_insol: number;
  koi_prad: number;
};

const isHabitablePlanet = (planet: Planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.33 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
};

async function loadPlanetsData() {
  const filePath = path.join(__dirname, "..", "..", "data", "kepler_data.csv");

  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, comment: "#" }))
      .on("data", async (data: Planet) => {
        if (isHabitablePlanet(data)) {
          savePlanet(data);
        }
      })
      .on("end", async () => {
        const habitablePlanetsNum = (await getHabitablePlanets())?.length;
        console.log(habitablePlanetsNum + " habitable planets found!");
        resolve();
      })
      .on("error", (err: Error) => reject(err));
  });
}

async function savePlanet(planet: Planet) {
  try {
    await planets.updateOne(
      { keplerName: planet.kepler_name },
      { keplerName: planet.kepler_name },
      { upsert: true }
    );
  } catch (error) {
    console.log("Error saving planet: " + error);
  }
}

async function getHabitablePlanets() {
  try {
    return await planets.find({}, { "_id": 0, "__v": 0 });
  } catch (error) {
    console.log("Error getting planets: " + error);
  }
}

export { loadPlanetsData, getHabitablePlanets };
