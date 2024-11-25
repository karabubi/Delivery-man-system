// // Load environment variables
// require("dotenv").config();

// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const { Client } = require("pg"); // PostgreSQL client
// const axios = require("axios"); // HTTP requests for OSRM public API

// const app = express(); // Initialize Express app
// const PORT = process.env.PORT || 3000; // Server port

// // Middleware
// app.use(bodyParser.json()); // Parse JSON payloads
// app.use(cors()); // Enable CORS for all routes

// // PostgreSQL Client Setup
// const db = new Client({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT || 5432,
// });

// db.connect()
//   .then(() => console.log("Database connected successfully"))
//   .catch((err) => console.error("Database connection error:", err.message));

// // Health Check
// app.get("/", (req, res) => {
//   res.status(200).send("Server is running");
// });

// // Fetch Users (Example Endpoint)
// app.get("/users", async (req, res) => {
//   try {
//     const result = await db.query("SELECT * FROM users");
//     res.status(200).json(result.rows);
//   } catch (err) {
//     console.error("Error fetching users:", err.message);
//     res.status(500).json({ error: "Failed to fetch users" });
//   }
// });

// // Delivery Management Endpoints
// app.get("/delivery", async (req, res) => {
//   try {
//     const result = await db.query("SELECT * FROM deliveries");
//     res.status(200).json(result.rows);
//   } catch (err) {
//     console.error("Error fetching deliveries:", err.message);
//     res.status(500).json({ error: "Failed to fetch deliveries" });
//   }
// });

// app.post("/delivery", async (req, res) => {
//   const { address, positionLatitude, positionLongitude } = req.body;

//   try {
//     const query = `
//       INSERT INTO deliveries (address, position_latitude, position_longitude)
//       VALUES ($1, $2, $3)
//       RETURNING *;
//     `;
//     const values = [address, positionLatitude, positionLongitude];
//     const result = await db.query(query, values);
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error("Error adding delivery:", err.message);
//     res.status(500).json({ error: "Failed to add delivery" });
//   }
// });

// // OSRM Public API Integration
// app.post("/api/best-route", async (req, res) => {
//   const { locations } = req.body; // Expecting an array of coordinates [lng, lat]

//   if (!locations || locations.length < 2) {
//     return res
//       .status(400)
//       .json({ error: "At least two locations are required." });
//   }

//   try {
//     // Prepare OSRM API URL
//     const coordinates = locations
//       .map((loc) => `${loc.lng},${loc.lat}`)
//       .join(";");
//     const apiUrl = `http://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full`;

//     // Call the OSRM API
//     const response = await axios.get(apiUrl);

//     if (
//       !response.data ||
//       !response.data.routes ||
//       response.data.routes.length === 0
//     ) {
//       throw new Error("No route found.");
//     }

//     // Extract route details
//     const route = response.data.routes[0];
//     const { distance, duration, geometry } = route;
//     const legs = route.legs.map((leg, index) => ({
//       legNumber: index + 1,
//       distance: leg.distance, // in meters
//       duration: leg.duration, // in seconds
//       summary: leg.summary,
//     }));

//     // Send response
//     res.status(200).json({
//       distance, // Total distance in meters
//       duration, // Total duration in seconds
//       legs, // Detailed legs of the route
//       geometry, // GeoJSON for visualization
//     });
//   } catch (err) {
//     console.error("Error calculating route:", err.message);
//     res
//       .status(500)
//       .json({ error: "Failed to calculate route", details: err.message });
//   }
// });

// // Start the Server
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });


// Load environment variables
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Client } = require("pg"); // PostgreSQL client
const axios = require("axios"); // HTTP requests for OSRM public API

const sequelize = require('./db'); // Sequelize database connection
const authRoutes = require('./routes/authRoutes'); // Authentication routes
const deliveryRoutes = require('./routes/deliveryRoutes'); // Delivery routes
const routeRoutes = require('./routes/routeRoutes'); // Route optimization routes

const app = express(); // Initialize Express app
const PORT = process.env.PORT || 3000; // Server port

// Middleware
app.use(bodyParser.json()); // Parse JSON payloads
app.use(cors()); // Enable CORS for all routes

// PostgreSQL Client Setup (Legacy Code for Testing)
const db = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

db.connect()
  .then(() => console.log("Legacy PostgreSQL connected successfully"))
  .catch((err) => console.error("Legacy Database connection error:", err.message));

// Health Check
app.get("/", (req, res) => {
  res.status(200).send("Server is running");
});

// Example Endpoint to Fetch Users from Legacy DB
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
    return res.status(400).json({ error: "At least two locations are required." });
  }

  try {
    const coordinates = locations.map((loc) => `${loc.lng},${loc.lat}`).join(";");
    const apiUrl = `http://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full`;

    const response = await axios.get(apiUrl);

    if (!response.data || !response.data.routes || response.data.routes.length === 0) {
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
    res.status(500).json({ error: "Failed to calculate route", details: err.message });
  }
});

// Modularized Routes
app.use('/auth', authRoutes); // Authentication (register, login)
app.use('/delivery', deliveryRoutes); // CRUD operations for deliveries
app.use('/route', routeRoutes); // Route optimization

// Initialize Sequelize and Start the Server
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
});
