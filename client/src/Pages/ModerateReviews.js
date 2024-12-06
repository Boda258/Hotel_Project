import React, { useState, useEffect } from "react";
import axios from "axios";

function ModerateReviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function fetchPendingReviews() {
      try {
        const token = localStorage.getItem("token");
        const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/reviews/pending`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReviews(result.data);
      } catch (error) {
        console.error("Error fetching pending reviews:", error);
      }
    }
    fetchPendingReviews();
  }, []);

  async function moderateReview(reviewId, status) {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/reviews/moderate/${reviewId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReviews(reviews.filter((review) => review._id !== reviewId));
      alert(`Review ${status.toLowerCase()} successfully`);
    } catch (error) {
      console.error("Error moderating review:", error);
      alert("Failed to update review status.");
    }
  }

  return (
    <div className="moderate-reviews mt-5">
      <h2>Moderate Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews pending moderation.</p>
      ) : (
        reviews.map((review) => (
          <div className="review" key={review._id}>
            <h4>{review.userId.username}</h4>
            <p>Rating: {review.rating} / 5</p>
            <p>{review.reviewText}</p>
            <button
              className="btn btn-success m-2"
              onClick={() => moderateReview(review._id, "Approved")}
            >
              Approve
            </button>
            <button
              className="btn btn-danger m-2"
              onClick={() => moderateReview(review._id, "Rejected")}
            >
              Reject
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default ModerateReviews;
