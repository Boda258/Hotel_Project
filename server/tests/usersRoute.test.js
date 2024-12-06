const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const User = require("../models/user");
const { expect } = chai;

chai.use(chaiHttp);

describe("User Routes", () => {
  // Before starting the tests, clean up the users collection
  before(async () => {
    await User.deleteMany({});
  });

  // Test user registration
  it("should register a new user", (done) => {
    const newUser = {
      username: "testuser",
      email: "testuser@example.com",
      password: "Test@1234",
      confirmpassword: "Test@1234",
    };

    chai
      .request(server)
      .post("/api/users/register")
      .send(newUser)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("message").equal("User registered successfully");
        done();
      });
  });

  // Test duplicate email registration
  it("should not register user with duplicate email", (done) => {
    const duplicateUser = {
      username: "testuser2",
      email: "testuser@example.com",
      password: "Test@1234",
      confirmpassword: "Test@1234",
    };

    chai
      .request(server)
      .post("/api/users/register")
      .send(duplicateUser)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("error").equal("Email is already registered");
        done();
      });
  });

  // Test login
  it("should log in an existing user", (done) => {
    const userCredentials = {
      email: "testuser@example.com",
      password: "Test@1234",
    };

    chai
      .request(server)
      .post("/api/users/login")
      .send(userCredentials)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message").equal("Login successful");
        expect(res.body).to.have.property("token");
        done();
      });
  });

  // Test login with wrong credentials
  it("should not log in with incorrect credentials", (done) => {
    const wrongCredentials = {
      email: "testuser@example.com",
      password: "wrongpassword",
    };

    chai
      .request(server)
      .post("/api/users/login")
      .send(wrongCredentials)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("error").equal("Invalid email or password");
        done();
      });
  });
});
