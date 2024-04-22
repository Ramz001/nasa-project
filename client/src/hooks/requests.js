async function httpGetPlanets() {
  const res = await fetch("/planets");
  return await res.json();
}

async function httpGetLaunches() {
  const res = await fetch("/launches");
  const fetchedLaunches = await res.json();
  return fetchedLaunches.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  });
}

async function httpSubmitLaunch(launch) {
  try {
    return await fetch("/launches", {
      method: "POST",
      body: JSON.stringify(launch),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return {
      ok: false,
      error
    }    
  }
}

async function httpAbortLaunch(id) {
  const res = await fetch(`/launch/${id}`, {
    method: "DELETE",
  });
  return await res.json()
  // TODO: Once API is ready.
  // Delete launch with given ID.
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
