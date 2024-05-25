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

describe("Test API route for User", () => {
  let createdUserId;
  let createdUserToken;

  it("should create a new user", async () => {
    const newUser = {
      email: "testuser@example.com",
      password: "password123",
      pseudo: "TestUser",
      role: "owner",
      firstname: "Test",
      lastname: "User",
    };

    const response = await request(server)
      .post("/api/login_user")
      .set("Authorization", `Bearer ${createdUserToken}`)
      .send(newUser);

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Utilisateur connecté avec succès");
    expect(response.body.user.email).toBe("testuser@example.com");
    createdUserId = response.body.user.id;
    createdUserToken = response.body.token;
  });

  it("should modify the created user", async () => {
    const updatedUser = {
      pseudo: "UpdatedUser",
      firstname: "Updated",
      lastname: "User",
    };

    const response = await request(server)
      .patch(`/api/mobile/user/${createdUserId}`)
      .set("Authorization", `Bearer ${createdUserToken}`)
      .send(updatedUser);

    expect(response.statusCode).toBe(200);
    expect(response.body.user.pseudo).toBe("UpdatedUser");
    expect(response.body.user.firstname).toBe("Updated");
    expect(response.body.user.lastname).toBe("User");
  });

  it("should delete the created user", async () => {
    const response = await request(server)
      .delete(`/api/mobile/user/${createdUserId}`)
      .set("Authorization", `Bearer ${createdUserToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("User deleted successfully");
  });
});
