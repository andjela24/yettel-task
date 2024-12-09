const request = require("supertest");
const app = require("../app");

describe("API Tests with Role-Based Permissions", () => {
  let adminToken;
  let basicToken;

  beforeAll(async () => {
    // Create ADMIN user
    const adminSignupRes = await request(app).post("/api/v1/auth/signup").send({
      firstName: "Admin",
      lastName: "User",
      userName: "admin.user",
      email: "admin@gmail.com",
      password: "admin123",
      confirmPassword: "admin123",
      role: "ADMIN",
    });

    adminToken = adminSignupRes.body.data.token;

    // Create BASIC user
    const basicSignupRes = await request(app).post("/api/v1/auth/signup").send({
      firstName: "Basic",
      lastName: "User",
      userName: "basic.user",
      email: "basic@gmail.com",
      password: "basic123",
      confirmPassword: "basic123",
      role: "BASIC",
    });

    basicToken = basicSignupRes.body.data.token;
  });

  it("should create a new user", async () => {
    jest.setTimeout(10000);
    const res = await request(app).post("/api/v1/auth/signup").send({
      firstName: "Lazar",
      lastName: "Lazarević",
      userName: "l.lazarevic",
      email: "llazarevic@gmail.com",
      password: "lazar123",
      confirmPassword: "lazar123",
      role: "BASIC",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body).toHaveProperty(
      "message",
      "Successfully created new user."
    );
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("email", "llazarevic@gmail.com");
    expect(res.body.data).toHaveProperty("userName", "l.lazarevic");
    expect(res.body.data).toHaveProperty("token");
  });

  it("should login and return a token", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "basic@gmail.com",
      password: "basic123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body).toHaveProperty("token");

    authToken = res.body.token;
  });

  it("BASIC user should create their own task", async () => {
    const res = await request(app)
      .post("/api/v1/tasks")
      .set("Authorization", `Bearer ${basicToken}`)
      .send({
        body: "Basic user's task",
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body.data).toHaveProperty("body", "Basic user's task");
  });

  it("BASIC user should list their own tasks", async () => {
    const res = await request(app)
      .get("/api/v1/tasks")
      .set("Authorization", `Bearer ${basicToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "success");
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("ADMIN user should list tasks of all users", async () => {
    const res = await request(app)
      .get("/api/v1/tasks")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "success");
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("ADMIN user should delete a BASIC user's task", async () => {
    const basicTaskRes = await request(app)
      .post("/api/v1/tasks")
      .set("Authorization", `Bearer ${basicToken}`)
      .send({
        body: "Task to delete by ADMIN",
      });

    const taskId = basicTaskRes.body.data.id;

    const res = await request(app)
      .delete(`/api/v1/tasks/${taskId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe("Record deleted successfully");
  });

  it("ADMIN user should update a BASIC user's personal information", async () => {
    const res = await request(app)
      .patch("/api/v1/users/2")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        firstName: "Updated Basic",
        lastName: "User",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty("firstName", "Updated Basic");
  });
});
