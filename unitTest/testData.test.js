const request = require("supertest");
const { sequelize } = require("../models");

let server; 

beforeAll(() => {
  process.env.PORT = 0;
  server = require("../server");
});

afterAll(done => {
  server.close(() => {
    sequelize.close().then(() => done());
  });
});

describe("Test API route", () => {
  it("should return true for the first row state", async () => {
    const response = await request(server).get("/api/test");
    expect(response.statusCode).toBe(200);
    expect(response.body[0].state).toBe(true);
  });
});
