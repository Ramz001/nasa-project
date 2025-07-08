import launchesMongo from "./launches.mongo";
import planetsMongo from "./planets.mongo";
import axios from "axios";

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

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function loadLaunchesData() {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  const launchData = response.data.docs;

  for (const launch of launchData) {
    const payloads = launch.payloads;
    const customers = payloads.flatMap((payload: any) => payload.customers);

    const launchDoc = {
      flightNumber: launch.flight_number,
      mission: launch.name,
      rocket: launch.rocket.name,
      launchDate: launch.date_local,
      upcoming: launch.upcoming,
      success: launch.success,
      customers,
    };
  }
}

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
  loadLaunchesData,
  Launch,
};
