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
      error,
    };
  }
}

async function httpAbortLaunch(id) {
  try {
    return await fetch(`/launches/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    return {
      ok: false,
      error,
    };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
