
// // Load environment variables
// require("dotenv").config();

// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const axios = require("axios"); // HTTP requests for OSRM public API
// const db = require("./util/db-connect"); // Knex database connection
// const routeRoutes = require("./routes/routeRoutes"); // Modularized route optimization
// const addressesRoute = require("./routes/addresses"); // Modularized address routes

// const app = express(); // Initialize Express app
// const PORT = process.env.PORT || 3000; // Server port

// // Middleware
// app.use(bodyParser.json()); // Parse JSON payloads
// app.use(cors()); // Enable CORS for all routes

// // Health Check
// app.get("/", (req, res) => {
//   res.status(200).send("Server is running");
// });

// // Use Modularized Routes
// app.use("/api/addresses", addressesRoute); // Address-related routes
// app.use("/route", routeRoutes); // Route optimization

// // Fetch All Users (Example Endpoint)
// app.get("/users", async (req, res) => {
//   try {
//     const result = await db("users").select("*");
//     res.status(200).json(result);
//   } catch (err) {
//     console.error("Error fetching users:", err.message);
//     res.status(500).json({ error: "Failed to fetch users" });
//   }
// });

// // Legacy Delivery Management Endpoints (Can be phased out over time)

// // Fetch All Deliveries
// app.get("/api/delivery", async (req, res) => {
//   try {
//     const result = await db("deliveries").select("*");
//     res.status(200).json(result);
//   } catch (err) {
//     console.error("Error fetching deliveries:", err.message);
//     res.status(500).json({ error: "Failed to fetch deliveries" });
//   }
// });

// // Add Delivery
// app.post("/delivery", async (req, res) => {
//   const { address, positionLatitude, positionLongitude } = req.body;

//   try {
//     const [newDelivery] = await db("deliveries").insert({
//       address,
//       position_latitude: positionLatitude,
//       position_longitude: positionLongitude
//     }).returning("*");

//     res.status(201).json(newDelivery);
//   } catch (err) {
//     console.error("Error adding delivery:", err.message);
//     res.status(500).json({ error: "Failed to add delivery" });
//   }
// });

// // OSRM Public API Integration - Legacy Route Calculation
// app.post("/api/best-route", async (req, res) => {
//   const { locations } = req.body;

//   if (!locations || locations.length < 2) {
//     return res.status(400).json({ error: "At least two locations are required." });
//   }

//   try {
//     const coordinates = locations
//       .map((loc) => `${loc.lng},${loc.lat}`)
//       .join(";");
//     const apiUrl = `http://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full`;

//     const response = await axios.get(apiUrl);

//     if (!response.data || !response.data.routes || response.data.routes.length === 0) {
//       throw new Error("No route found.");
//     }

//     const route = response.data.routes[0];
//     const { distance, duration, geometry } = route;
//     const legs = route.legs.map((leg, index) => ({
//       legNumber: index + 1,
//       distance: leg.distance,
//       duration: leg.duration,
//       summary: leg.summary,
//     }));

//     res.status(200).json({
//       distance,
//       duration,
//       legs,
//       geometry,
//     });
//   } catch (err) {
//     console.error("Error calculating route:", err.message);
//     res.status(500).json({ error: "Failed to calculate route", details: err.message });
//   }
// });

// // Start the Server
// app.listen(PORT, () =>
//   console.log(`Server running at http://localhost:${PORT}`)
// );


//--------28-11-24-1508

// Load environment variables

// Load environment variables

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios"); // HTTP requests for OSRM public API
const db = require("./util/db-connect"); // Knex database connection
const routeRoutes = require("./routes/routeRoutes"); // Modularized route optimization
const addressesRoute = require("./routes/addresses"); // Modularized address routes

const app = express(); // Initialize Express app
const PORT = process.env.PORT || 3000; // Server port

// Middleware
app.use(bodyParser.json()); // Parse JSON payloads
app.use(cors()); // Enable CORS for all routes

// Health Check
app.get("/", (req, res) => {
  res.status(200).send("Server is running");
});

// Use Modularized Routes
app.use("/api/addresses", addressesRoute); // Address-related routes
app.use("/route", routeRoutes); // Route optimization

// Fetch All Deliveries (Updated)
app.get("/api/delivery", async (req, res) => {
  try {
    const deliveries = await db("deliveries").select("*");
    if (deliveries.length === 0) {
      return res.status(404).json({ message: "No deliveries found." });
    }
    res.status(200).json(deliveries);
  } catch (err) {
    console.error("Error fetching deliveries:", err.message);
    res.status(500).json({
      error: "Failed to fetch deliveries",
      details: err.message,
    });
  }
});

// Add Delivery (Updated)
app.post("/delivery", async (req, res) => {
  const { address, positionLatitude, positionLongitude } = req.body;

  if (!address || !positionLatitude || !positionLongitude) {
    return res.status(400).json({
      error: "Missing required fields. Please provide address, latitude, and longitude.",
    });
  }

  try {
    const [newDelivery] = await db("deliveries")
      .insert({
        address,
        position_latitude: positionLatitude,
        position_longitude: positionLongitude,
      })
      .returning("*");

    res.status(201).json(newDelivery);
  } catch (err) {
    console.error("Error adding delivery:", err.message);
    res.status(500).json({
      error: "Failed to add delivery",
      details: err.message,
    });
  }
});

// OSRM Public API Integration - Route Calculation (Updated)
app.post("/api/best-route", async (req, res) => {
  const { locations } = req.body;

  // Validation: Ensure at least two locations are provided
  if (!locations || locations.length < 2) {
    return res.status(400).json({ error: "At least two locations are required." });
  }

  // Prepare coordinates in the required format
  const coordinates = locations.map((loc) => `${loc.lng},${loc.lat}`).join(";");

  // Construct the OSRM API URL using the base URL from environment variables
  const osrmBaseUrl = process.env.OSRM_BASE_URL || "http://router.project-osrm.org";
  const apiUrl = `${osrmBaseUrl}/route/v1/driving/${coordinates}?overview=full`;

  try {
    // Request route from OSRM API
    const response = await axios.get(apiUrl);

    // Error Handling: Check if response contains valid routes
    if (!response.data || !response.data.routes || response.data.routes.length === 0) {
      return res.status(404).json({ error: "No route found." });
    }

    // Extract route data from the response
    const route = response.data.routes[0];
    const { distance, duration, geometry } = route;

    // Calculate individual legs of the route
    const legs = route.legs.map((leg, index) => ({
      legNumber: index + 1,
      distance: leg.distance,
      duration: leg.duration,
      summary: leg.summary,
    }));

    // Send back the route data including distance, duration, legs, and geometry
    res.status(200).json({
      distance,
      duration,
      legs,
      geometry,
    });
  } catch (err) {
    // Enhanced error logging and handling
    console.error("Error calculating route:", err.message);
    res.status(500).json({ error: "Failed to calculate route", details: err.message });
  }
});

// Legacy OSRM Public API Integration (Updated)
app.post("/api/get-route", async (req, res) => {
  const { locations } = req.body;

  if (!locations || locations.length < 2) {
    return res.status(400).json({ error: "At least two locations are required." });
  }

  try {
    // Prepare coordinates in the format "longitude,latitude"
    const coordinates = locations.map((loc) => `${loc.longitude},${loc.latitude}`).join(";");
    const osrmBaseUrl = process.env.OSRM_BASE_URL || "http://router.project-osrm.org";
    const osrmUrl = `${osrmBaseUrl}/route/v1/driving/${coordinates}?overview=false`;

    const response = await axios.get(osrmUrl);

    // Error handling if no routes are returned
    if (!response.data || !response.data.routes || response.data.routes.length === 0) {
      console.error("OSRM API returned no routes:", response.data);
      return res.status(404).json({ error: "No route found" });
    }

    const route = response.data.routes[0].geometry.coordinates;
    res.json({ route });
  } catch (err) {
    console.error("Error during OSRM API request:", err.message);
    res.status(500).json({ error: "Error calculating route", details: err.message });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});






//--------28-11-24-1508


//-------27-11-24-20:25

// Load environment variables from a .env file

// require("dotenv").config();

// // Import necessary libraries
// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const axios = require("axios"); // For making HTTP requests to OSRM API
// const db = require("./util/db-connect"); // Knex database connection (configured in your utility)

// // Initialize Express app
// const app = express();
// const PORT = process.env.PORT || 3000; // Port for the server

// // Middleware Setup
// app.use(bodyParser.json()); // Middleware to parse JSON requests
// app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS) for all routes

// // Health Check Route to verify if the server is running
// app.get("/", (req, res) => {
//   res.status(200).send("Server is running");
// });

// // Delivery Management Endpoints

// // Fetch All Deliveries from the database
// app.get("/api/delivery", async (req, res) => {
//   try {
//     const deliveries = await db("deliveries").select("*"); // Querying the "deliveries" table

//     // If no deliveries are found, return a 404 status with a message
//     if (deliveries.length === 0) {
//       return res.status(404).json({ message: "No deliveries found" });
//     }

//     // Return the deliveries in the response with a 200 OK status
//     res.status(200).json({ deliveries });
//   } catch (err) {
//     console.error("Error fetching deliveries:", err.message); // Log any error
//     res.status(500).json({
//       error: "Failed to fetch deliveries", // Send error response
//       details: err.message, // Optionally send the error details for debugging
//     });
//   }
// });

// // Add a New Delivery
// app.post("/delivery", async (req, res) => {
//   const { address, positionLatitude, positionLongitude } = req.body;

//   try {
//     // Insert the new delivery into the "deliveries" table
//     const [newDelivery] = await db("deliveries").insert({
//       address,
//       position_latitude: positionLatitude,
//       position_longitude: positionLongitude,
//     }).returning("*"); // Return the newly inserted delivery

//     res.status(201).json(newDelivery); // Respond with the new delivery data and a 201 status
//   } catch (err) {
//     console.error("Error adding delivery:", err.message);
//     res.status(500).json({ error: "Failed to add delivery" });
//   }
// });

// // Route Calculation using OSRM or OpenRouteService
// app.post("/api/best-route", async (req, res) => {
//   const { locations } = req.body; // Locations expected to be an array of { lat, lng } objects

//   // Ensure there are at least two locations to calculate a route
//   if (!locations || locations.length < 2) {
//     return res.status(400).json({ error: "At least two locations are required." });
//   }

//   try {
//     // Convert locations to OSRM API format (longitude,latitude)
//     const coordinates = locations
//       .map((loc) => `${loc.lng},${loc.lat}`)
//       .join(";"); // Join coordinates with semicolons

//     // OSRM Public API URL (latest version)
//     const apiUrl = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&steps=true`;

//     // Request to the OSRM API
//     const response = await axios.get(apiUrl);

//     // If no route is found, return an error
//     if (!response.data || !response.data.routes || response.data.routes.length === 0) {
//       throw new Error("No route found.");
//     }

//     // Extract relevant data from the route
//     const route = response.data.routes[0]; // Get the first route
//     const { distance, duration, geometry } = route; // Get the total distance, duration, and geometry (GeoJSON)

//     // Break down the route into individual legs (segments)
//     const legs = route.legs.map((leg, index) => ({
//       legNumber: index + 1,
//       distance: leg.distance,
//       duration: leg.duration,
//       summary: leg.summary, // e.g., "Turn left onto Main St"
//     }));

//     // Send the calculated route data back to the client
//     res.status(200).json({
//       distance,  // Total route distance in meters
//       duration,  // Total route duration in seconds
//       legs,      // Array of individual legs (segments)
//       geometry,  // Geometry (GeoJSON format)
//     });

//   } catch (err) {
//     console.error("Error calculating route:", err.message);
//     res.status(500).json({
//       error: "Failed to calculate route", // Send error response
//       details: err.message, // Optionally send the error details for debugging
//     });
//   }
// });

// // Start the Express server
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });
