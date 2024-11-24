

// Load environment variables
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Client } = require("pg"); // PostgreSQL client
const axios = require("axios"); // HTTP requests for OSRM public API

const app = express(); // Initialize Express app
const PORT = process.env.PORT || 3000; // Server port

// Middleware
app.use(bodyParser.json()); // Parse JSON payloads
app.use(cors()); // Enable CORS for all routes

// PostgreSQL Client Setup
const db = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

db.connect()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection error:", err.message));

// Health Check
app.get("/", (req, res) => {
  res.status(200).send("Server is running");
});

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

// Delivery Management Endpoints
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

// OSRM Public API Integration
app.get("/api/best-route", async (req, res) => {
  const encodedPolyline = req.query.polyline || "ofp_Ik_vpAilAyu@te@g`E"; // Example polyline

  try {
    const apiUrl = `http://router.project-osrm.org/route/v1/driving/polyline(${encodedPolyline})?overview=false`;
    const response = await axios.get(apiUrl);

    const route = response.data.routes[0];
    const legs = route.legs.map((leg) => ({
      distance: leg.distance, // Distance in meters
      duration: leg.duration, // Duration in seconds
      summary: leg.summary, // Road summary
    }));

    res.status(200).json({
      distance: route.distance, // Total distance
      duration: route.duration, // Total duration
      legs, // Route leg details
    });
  } catch (err) {
    console.error("Error calculating route:", err.message);
    res.status(500).json({ error: "Failed to calculate route" });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});




