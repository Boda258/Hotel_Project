import React from "react";
import { Link } from "react-router-dom";

function HotelCard({ hotel }) {
  return (
    <div className="hotel-card mt-3 p-3 border rounded">
      <h4>{hotel.name}</h4>
      <p>{hotel.description}</p>
      <Link to={`/hotel/${hotel._id}`} className="btn btn-primary">
        View Hotel
      </Link>
    </div>
  );
}

export default HotelCard;
