const launchesRequest = require("supertest");
const launchesApp = require("../../app");

describe("GET /launches", () => {
  test("main", async () => {
    await launchesRequest(launchesApp)
      .get("/launches")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});
describe("POST /launches", () => {
  const launchMock = {
    mission: "abc",
    rocket: "IS7",
    target: "Kepler 123",
    launchDate: "January 4, 2030",
  };
  const launchDataNoDate = {
    mission: "abc",
    rocket: "IS7",
    target: "Kepler 123",
  };

  test("Code 201", async () => {
    const response = await launchesRequest(launchesApp)
      .post("/launches")
      .send(launchMock)
      .expect("Content-Type", /json/)
      .expect(201);

    const launchesRequestDate = new Date(launchMock.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();

    expect(launchesRequestDate).toBe(responseDate);
    expect(response.body).toMatchObject(launchDataNoDate);
  });
  test("Missing Properties Code 400", async () => {
    const response = await launchesRequest(launchesApp)
      .post("/launches")
      .send(launchDataNoDate)
      .expect("Content-Type", /json/)
      .expect(400);
    expect(response.body).toStrictEqual({
      error: "Missing required lauch properties!",
    });
  });
  test("Invalid Date Code 400", async () => {
    const response = await launchesRequest(launchesApp)
      .post("/launches")
      .send({ ...launchDataNoDate, launchDate: "hello" })
      .expect("Content-Type", /json/)
      .expect(400);
    expect(response.body).toStrictEqual({ error: "Invalid launch date!" });
  });
});
describe("DELETE /launches", () => {});
