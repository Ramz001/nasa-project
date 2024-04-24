const launches = new Map<number, Launch>();

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

let latestFlightNumber = 100;

const launch1: Launch = {
  mission: "something",
  rocket: "very big one",
  launchDate: new Date("December 27, 2045"),
  target: "Mars 132",
  flightNumber: 1,
  customers: ["nasa"],
  success: false,
  upcoming: true,
};

const launch2: Launch = {
  mission: "something in History",
  rocket: "smaller one",
  launchDate: new Date("December 27, 2012"),
  target: "Venus 123",
  flightNumber: 2,
  customers: ["NASA", "ISS"],
  success: true,
  upcoming: false,
};

launches.set(launch1.flightNumber, launch1);
launches.set(launch2.flightNumber, launch2);

function getAllLaunches() {
  return Array.from(launches.values());
}

async function scheduleOneLaunch(launch: Launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      success: true,
      upcoming: true,
      customers: ["NASA"],
      flightNumber: latestFlightNumber,
    })
  );
}

function launchExists(flightNumber: number) {
  if (launches.has(flightNumber)) { 
    return true;
  }
  return false;
}

function abortOneLaunch(flightNumber: number) {
  const abortedLaunch = launches.get(flightNumber);
  if (abortedLaunch) {
    abortedLaunch.upcoming = false;
    abortedLaunch.success = false;
    return abortedLaunch;
  }
  return new Error("Cannot abort a launch");
}

export { getAllLaunches, scheduleOneLaunch, abortOneLaunch, launchExists, Launch };
