require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require('./db');
const usersRoute = require('./routes/usersRoute');
const reviewRoute = require('./routes/reviewRoute');
const hotelRoute = require('./routes/hotelRoute');
const Hotel = require('./models/hotel'); // Import the Hotel model

const app = express();

// Enable CORS
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// Register routes
app.use('/api/users', usersRoute);
app.use('/api/reviews', reviewRoute);
app.use('/api/hotels', hotelRoute);

// Connect to database
connectDB().then(() => {
  addSampleHotels(); // Add sample hotels if not present when DB connects
});

// Function to add sample hotels if they do not exist
async function addSampleHotels() {
  try {
    const existingHotels = await Hotel.find();
    if (existingHotels.length === 0) {
      const sampleHotels = [
        {
          name: "Grand Luxury Hotel",
          description: "A beautiful hotel with excellent amenities and breathtaking views.",
          location: "Paris, France",
        },
        {
          name: "City Comfort Inn",
          description: "Perfect for business travelers, located in the heart of downtown.",
          location: "New York, USA",
        },
        {
          name: "Beachside Resort",
          description: "Enjoy the serene seaside views and luxurious facilities at our resort.",
          location: "Malibu, USA",
        },
      ];

      await Hotel.insertMany(sampleHotels);
      console.log("Sample hotels added successfully.");
    } else {
      console.log("Sample hotels already exist.");
    }
  } catch (error) {
    console.error("Error adding sample hotels:", error);
  }
}

// Start server
app.listen(8080, () => console.log("Server running on port 8080"));
