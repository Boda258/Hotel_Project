const express = require("express");
const mongoose = require("mongoose");
const Review = require("../models/review");
const authenticateJWT = require("../middleware/authenticateJWT");
const router = express.Router();

// Submit a Review
router.post("/submit", authenticateJWT, async (req, res) => {
  const { hotelId, rating, reviewText } = req.body;

  // Validate the rating value
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  try {
    const newReview = new Review({
      userId: req.user.id, // Extract user ID from authenticated request
      hotelId,
      rating,
      reviewText,
    });

    await newReview.save();
    return res.status(201).json({ message: "Review submitted successfully" });
  } catch (error) {
    console.error("Error saving review:", error);
    return res.status(500).json({ error: "Failed to submit review" });
  }
});

// Fetch All Reviews for a Hotel
router.get("/hotel/:hotelId", async (req, res) => {
  const { hotelId } = req.params;

  try {
    const reviews = await Review.find({ hotelId }).populate("userId", "username");
    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// Fetch Average Rating for a Hotel
router.get("/hotel/:hotelId/average", async (req, res) => {
  const { hotelId } = req.params;

  try {
    const result = await Review.aggregate([
      { $match: { hotelId: hotelId } },
      { $group: { _id: "$hotelId", averageRating: { $avg: "$rating" } } },
    ]);
    const averageRating = result.length > 0 ? result[0].averageRating : 0;
    return res.status(200).json({ averageRating });
  } catch (error) {
    console.error("Error calculating average rating:", error);
    return res.status(500).json({ error: "Failed to calculate average rating" });
  }
});

// Moderate Reviews
router.put("/moderate/:reviewId", authenticateJWT, async (req, res) => {
  const { reviewId } = req.params;
  const { status } = req.body;

  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "You do not have permission to moderate reviews" });
  }

  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    return res.status(400).json({ error: "Invalid review ID format" });
  }

  try {
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { status },
      { new: true }
    );
    return res.status(200).json(updatedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    return res.status(500).json({ error: "Failed to update review" });
  }
});

module.exports = router;
