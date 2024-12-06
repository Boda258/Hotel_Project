import React, { useState, useEffect } from "react";
import axios from "axios";

function ReviewsList({ hotelId }) {
  const [reviews, setReviews] = useState([]);
  const [sortType, setSortType] = useState("recent");

  useEffect(() => {
    async function fetchReviews() {
      try {
        const result = await axios.get(`http://localhost:8080/api/reviews/hotel/${hotelId}`);
        setReviews(result.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }

    fetchReviews();
  }, [hotelId]);

  function sortReviews() {
    const sorted = [...reviews];
    if (sortType === "highest") {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortType === "recent") {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    setReviews(sorted);
  }

  useEffect(() => {
    sortReviews();
  }, [sortType]);

  return (
    <div className="review-list mt-5">
      <div className="sort-options">
        <label>Sort By:</label>
        <select onChange={(e) => setSortType(e.target.value)} value={sortType}>
          <option value="recent">Most Recent</option>
          <option value="highest">Highest Rating</option>
        </select>
      </div>
      {reviews.map((review) => (
        <div className="review" key={review._id}>
          <h4>{review.userId.username}</h4>
          <p>Rating: {review.rating} / 5</p>
          <p>{review.reviewText}</p>
          <p><strong>Response:</strong> {review.response || "No response yet"}</p>
        </div>
      ))}
    </div>
  );
}

export default ReviewsList;
