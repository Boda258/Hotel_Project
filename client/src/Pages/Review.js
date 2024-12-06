import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";

function Review({ hotelId }) {
  const [rating, setRating] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const { user } = useContext(UserContext);

  async function Review() {
    // Checking if user is authenticated or not
    if (!user || !user._id) {
      alert("You must be logged in to submit a review.");
      return;
    }

    const review = {
      userId: user._id,
      hotelId, 
      rating,
      reviewText,
    };

    try {
      await axios.post("http://localhost:8080/api/reviews/submit", review);
      alert("Review submitted successfully!");
      setReviewText("");
      setRating(1);
    } catch (error) {
      console.error("Error submitting review:", error.response ? error.response.data : error.message);
      alert("Failed to submit review.");
    }
  }

  return (
    <div className="container mt-5">
      <h2>Submit Your Review</h2>
      <label>Rating (1-5)</label>
      <input
        type="number"
        min="1"
        max="5"
        className="form-control"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      />
      <textarea
        className="form-control mt-3"
        placeholder="Write your review here"
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      />
      <button className="btn btn-primary w-100 mt-3" onClick={Review}>
        Submit Review
      </button>
    </div>
  );
}
export default Review;
