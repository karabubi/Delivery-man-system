// Load environment variables
require("dotenv").config();
const routeRoutes = require("./routes/routeRoutes"); // Adjust the path if needed

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Client } = require("pg"); // PostgreSQL client
const axios = require("axios"); // HTTP requests for OSRM public API
const addressesRoute=require("./routes/addresses.js")
const app = express(); // Initialize Express app
const PORT = process.env.PORT || 3000; // Server port

// Middleware
app.use(bodyParser.json()); // Parse JSON payloads
app.use(cors()); // Enable CORS for all routes

// Health Check
app.get("/", (req, res) => {
  res.status(200).send("Server is running");
});
app.use("/api/addresses",addressesRoute)
// Fetch Users (Example Endpoint)
app.get("/users", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Legacy Delivery Management Endpoints (Optional, can be phased out)
app.get("/delivery", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM deliveries");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching deliveries:", err.message);
    res.status(500).json({ error: "Failed to fetch deliveries" });
  }
});

app.post("/delivery", async (req, res) => {
  const { address, positionLatitude, positionLongitude } = req.body;

  try {
    const query = `
      INSERT INTO deliveries (address, position_latitude, position_longitude)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [address, positionLatitude, positionLongitude];
    const result = await db.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding delivery:", err.message);
    res.status(500).json({ error: "Failed to add delivery" });
  }
});

// OSRM Public API Integration (Legacy)
app.post("/api/best-route", async (req, res) => {
  const { locations } = req.body;

  if (!locations || locations.length < 2) {
    return res
      .status(400)
      .json({ error: "At least two locations are required." });
  }

  try {
    const coordinates = locations
      .map((loc) => `${loc.lng},${loc.lat}`)
      .join(";");
    const apiUrl = `http://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full`;

    const response = await axios.get(apiUrl);

    if (
      !response.data ||
      !response.data.routes ||
      response.data.routes.length === 0
    ) {
      throw new Error("No route found.");
    }

    const route = response.data.routes[0];
    const { distance, duration, geometry } = route;
    const legs = route.legs.map((leg, index) => ({
      legNumber: index + 1,
      distance: leg.distance,
      duration: leg.duration,
      summary: leg.summary,
    }));

    res.status(200).json({
      distance,
      duration,
      legs,
      geometry,
    });
  } catch (err) {
    console.error("Error calculating route:", err.message);
    res
      .status(500)
      .json({ error: "Failed to calculate route", details: err.message });
  }
});

// Modularized Routes
//app.use('/auth', authRoutes); // Authentication (register, login)
app.use("/route", routeRoutes); // Route optimization

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
