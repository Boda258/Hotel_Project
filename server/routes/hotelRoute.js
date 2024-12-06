const express = require("express");
const mongoose = require("mongoose");
const Hotel = require("../models/hotel");

const router = express.Router();

// Fetch All Hotels
router.get("/", async (req, res) => {
  try {
    const hotels = await Hotel.find();
    return res.status(200).json(hotels);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    return res.status(500).json({ error: "Failed to fetch hotels" });
  }
});

// Fetch Single Hotel by ID
router.get("/:hotelId", async (req, res) => {
  const { hotelId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(hotelId)) {
    return res.status(400).json({ error: "Invalid hotel ID format" });
  }

  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }
    return res.status(200).json(hotel);
  } catch (error) {
    console.error("Error fetching hotel:", error);
    return res.status(500).json({ error: "Failed to fetch hotel" });
  }
});

// Add Sample Hotels
router.post("/add-sample-hotels", async (req, res) => {
  try {
    const sampleHotels = [
      {
        name: "Grand Luxury Hotel",
        description: "A beautiful hotel with excellent amenities and breathtaking views.",
      },
      {
        name: "City Comfort Inn",
        description: "Perfect for business travelers, located in the heart of downtown.",
      },
      {
        name: "Beachside Resort",
        description: "Enjoy the serene seaside views and luxurious facilities at our resort.",
      },
    ];

    const createdHotels = await Hotel.insertMany(sampleHotels);
    return res.status(201).json({ message: "Sample hotels added successfully", hotels: createdHotels });
  } catch (error) {
    console.error("Error adding sample hotels:", error);
    return res.status(500).json({ error: "Failed to add sample hotels" });
  }
});

module.exports = router;
  