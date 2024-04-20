const { parse } = require("csv-parse");
const fs = require("fs");
import path from "path";

type planet = {
  kepid: string;
  kepler_name: string;
  koi_disposition: string;
  koi_insol: number;
  koi_prad: number;
};

const habitablePlanets: planet[] = [];

const isHabitablePlanet = (planet: planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.33 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
};

async function getPlanetsData() {
  const filePath = path.join(__dirname, "..", "..", "data", "kepler_data.csv");

  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, comment: "#" }))
      .on("data", (data: planet) => {
        if (isHabitablePlanet(data)) {
          habitablePlanets.push(data);
        }
      })
      .on("end", () => {
        console.log(habitablePlanets.length + " habitable planets found!");
        resolve();
      })
      .on("error", (err: Error) => reject(err));
  });
}

export { getPlanetsData, habitablePlanets };
