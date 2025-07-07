import launchesRequest from "supertest";
import launchesApp from "../../app";
import { mongoConnect, mongoDisconnect } from "../../services/mongo";
import { loadPlanetsData } from "../../models/planets.model";

jest.setTimeout(20000);

describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanetsData();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("GET /launches", () => {
    test("main", async () => {
      await launchesRequest(launchesApp)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("POST /launches", () => {
    const launchMock = {
      mission: "abc",
      rocket: "IS7",
      target: "Kepler-442 b",
      launchDate: "January 4, 2030",
    };
    const launchDataNoDate = {
      mission: "abc",
      rocket: "IS7",
      target: "Kepler-442 b",
    };

    test("Code 201", async () => {
      const response = await launchesRequest(launchesApp)
        .post("/v1/launches")
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
        .post("/v1/launches")
        .send(launchDataNoDate)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(response.body).toStrictEqual({
        error: "Missing required lauch properties!",
      });
    });

    test("Invalid Date Code 400", async () => {
      const response = await launchesRequest(launchesApp)
        .post("/v1/launches")
        .send({ ...launchMock, launchDate: "hello" })
        .expect("Content-Type", /json/)
        .expect(400);
      expect(response.body).toStrictEqual({ error: "Invalid launch date!" });
    });
  });

  describe("DELETE /launches", () => {});
});
