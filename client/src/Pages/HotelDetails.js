import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import { useParams } from "react-router-dom";

function HotelDetails() {
  const { hotelId } = useParams();
  const [averageRating, setAverageRating] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const { user } = useContext(UserContext);

  // Memoize the fetch functions to avoid re-creating them every render
  const fetchAverageRating = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/reviews/hotel/${hotelId}/average`);
      setAverageRating(response.data.averageRating);
    } catch (error) {
      console.error("Error fetching average rating:", error);
    }
  }, [hotelId]);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/reviews/hotel/${hotelId}`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }, [hotelId]);

  useEffect(() => {
    fetchAverageRating();
    fetchReviews();
  }, [fetchAverageRating, fetchReviews]);

  // Submit a New Review
  async function submitReview() {
    if (!user || !user.token) {
      alert("You must be logged in to submit a review.");
      return;
    }

    const review = {
      userId: user.id,
      hotelId,
      rating,
      reviewText,
    };

    try {
      await axios.post("http://localhost:8080/api/reviews/submit", review, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      alert("Review submitted successfully!");
      setReviewText("");
      setRating(1);
      fetchReviews(); // Re-fetch reviews to update the list
      fetchAverageRating(); // Re-fetch average rating to update the score
    } catch (error) {
      console.error("Error submitting review:", error.response ? error.response.data : error.message);
      alert("Failed to submit review.");
    }
  }

  return (
    <div className="container mt-5">
      <h2>Hotel Details</h2>

      {/* Average Rating Display */}
      <div className="average-rating mt-3">
        <h4>Average Rating:</h4>
        {averageRating !== null ? (
          <p>{averageRating.toFixed(1)} / 5</p>
        ) : (
          <p>Loading average rating...</p>
        )}
      </div>

      {/* Submit a Review Form */}
      <div className="submit-review mt-5">
        <h4>Submit Your Review</h4>
        <label>Rating (1-5)</label>
        <input
          type="number"
          min="1"
          max="5"
          className="form-control"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        />
        <textarea
          className="form-control mt-3"
          placeholder="Write your review here"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />
        <button className="btn btn-primary w-100 mt-3" onClick={submitReview}>
          Submit Review
        </button>
      </div>

      {/* Display All Reviews */}
      <div className="reviews-list mt-5">
        <h4>Reviews</h4>
        {reviews.length === 0 ? (
          <p>No reviews available.</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="review mt-3 p-3 border rounded">
              <h5>User: {review.userId.username}</h5>
              <p>Rating: {review.rating} / 5</p>
              <p>{review.reviewText}</p>
              <p>
                <strong>Response:</strong> {review.response || "No response yet"}
              </p>
              <p className="text-muted">Status: {review.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HotelDetails;
