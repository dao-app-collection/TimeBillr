const request = require("supertest");

const app = require("../app");

describe("Register Endpoints", () => {
  it("should create a new user", async () => {
    const res = await request(app).post("/api/user/register").send({
      name: "Clinton Gillespie",
      password: "clinton2",
      email: "clintongillespie@outlook.com",
    });

    expect(res.statusCode).toEqual(200);
  });
});
