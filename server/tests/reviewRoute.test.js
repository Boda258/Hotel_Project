const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const Review = require("../models/review");
const User = require("../models/user");
const { expect } = chai;

chai.use(chaiHttp);

describe("Review Routes", () => {
  let token;
  let userId;
  let hotelId = "6123456789abcdef12345678"; // Mocked hotel ID for testing

  // Before starting the tests, create a user to authenticate and clean up reviews collection
  before(async () => {
    await Review.deleteMany({});
    await User.deleteMany({});

    // Register and login to get a valid token
    const newUser = {
      username: "reviewUser",
      email: "reviewUser@example.com",
      password: "Test@1234",
      confirmpassword: "Test@1234",
    };

    await chai
      .request(server)
      .post("/api/users/register")
      .send(newUser)
      .then((res) => {
        token = res.body.token;
        userId = res.body.user.id;
      });
  });

  // Test submit review
  it("should submit a new review", (done) => {
    const review = {
      userId,
      hotelId,
      rating: 4,
      reviewText: "Great hotel, friendly staff!",
    };

    chai
      .request(server)
      .post("/api/reviews/submit")
      .set("Authorization", `Bearer ${token}`)
      .send(review)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("message").equal("Review submitted successfully");
        done();
      });
  });

  // Test fetching reviews for a hotel
  it("should fetch all reviews for a hotel", (done) => {
    chai
      .request(server)
      .get(`/api/reviews/hotel/${hotelId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        expect(res.body.length).to.be.greaterThan(0);
        done();
      });
  });

  // Test fetching average rating for a hotel
  it("should fetch average rating for a hotel", (done) => {
    chai
      .request(server)
      .get(`/api/reviews/hotel/${hotelId}/average`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("averageRating");
        done();
      });
  });

  // Test moderating a review
  it("should approve a review", (done) => {
    // First, get a review to moderate
    Review.findOne({ hotelId }).then((review) => {
      chai
        .request(server)
        .put(`/api/reviews/moderate/${review._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ status: "Approved" })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("status").equal("Approved");
          done();
        });
    });
  });
});
