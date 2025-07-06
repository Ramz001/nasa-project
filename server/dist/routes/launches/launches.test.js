"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const launchesRequest = require("supertest");
const launchesApp = require("../../app");
describe("GET /launches", () => {
    test("main", () => __awaiter(void 0, void 0, void 0, function* () {
        yield launchesRequest(launchesApp)
            .get("/launches")
            .expect("Content-Type", /json/)
            .expect(200);
    }));
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
    test("Code 201", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield launchesRequest(launchesApp)
            .post("/launches")
            .send(launchMock)
            .expect("Content-Type", /json/)
            .expect(201);
        const launchesRequestDate = new Date(launchMock.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();
        expect(launchesRequestDate).toBe(responseDate);
        expect(response.body).toMatchObject(launchDataNoDate);
    }));
    test("Missing Properties Code 400", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield launchesRequest(launchesApp)
            .post("/launches")
            .send(launchDataNoDate)
            .expect("Content-Type", /json/)
            .expect(400);
        expect(response.body).toStrictEqual({
            error: "Missing required lauch properties!",
        });
    }));
    test("Invalid Date Code 400", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield launchesRequest(launchesApp)
            .post("/launches")
            .send(Object.assign(Object.assign({}, launchDataNoDate), { launchDate: "hello" }))
            .expect("Content-Type", /json/)
            .expect(400);
        expect(response.body).toStrictEqual({ error: "Invalid launch date!" });
    }));
});
describe("DELETE /launches", () => { });
