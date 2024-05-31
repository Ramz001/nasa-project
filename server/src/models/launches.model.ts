import launchesMongo from "./launches.mongo";
import planetsMongo from "./planets.mongo";

type Launch = {
  mission: string;
  rocket: string;
  launchDate: Date;
  target: string;
  flightNumber: number;
  customers: string[];
  upcoming: boolean;
  success: boolean;
};

const DEFAULT_FLIGHT_NUMBER = 100;

async function getAllLaunches() {
  try {
    return await launchesMongo.find({}, { _id: 0, __v: 0 });
  } catch (error) {
    console.log("Error getting launches: " + error);
  }
}

async function scheduleOneLaunch(launch: Launch) {
  const flightNumber = await getLatestFlightNumber();
  if (!flightNumber) {
    throw new Error("Flight Number is undefined");
  }
  console.log(flightNumber);
  const newFlightNumber = flightNumber + 1;

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["Hourglass", "Nasa"],
    flightNumber: newFlightNumber,
  });

  return await saveLaunch(newLaunch);
}

async function launchExists(flightNumber: number) {
  try {
    return await launchesMongo.findOne({ flightNumber });
  } catch (error) {
    console.log(error);
  }
}

async function saveLaunch(launch: Launch) {
  const planet = await planetsMongo.findOne({ keplerName: launch.target });

  if (!planet) {
    throw new Error("No matching planet found");
  }
  await launchesMongo.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    {
      upsert: true,
    }
  );
}

async function getLatestFlightNumber() {
  try {
    const latestLaunch = await launchesMongo.findOne().sort("-flightNumber");

    if (!latestLaunch) {
      return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;
  } catch (error: any) {
    console.log(error);
  }
}

async function abortOneLaunch(flightNumber: number) {
  try {
    return await launchesMongo.updateOne(
      {
        flightNumber,
      },
      { success: false, upcoming: false }
    );
  } catch (error) {
    console.log(error);
  }
}

export {
  getAllLaunches,
  scheduleOneLaunch,
  abortOneLaunch,
  launchExists,
  Launch,
};
