
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

  // Ensure there are at least two locations
  if (!locations || locations.length < 2) {
    return res.status(400).json({ error: "At least two locations are required." });
  }

  try {
    // Prepare coordinates in the format "longitude,latitude"
    const coordinates = locations.map((loc) => `${loc.longitude},${loc.latitude}`).join(";");

    // Construct OSRM API URL
    const osrmBaseUrl = process.env.OSRM_BASE_URL || "http://router.project-osrm.org";
    const osrmUrl = `${osrmBaseUrl}/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;

    // Send request to OSRM API
    const response = await axios.get(osrmUrl);

    // Error handling if no routes are returned
    if (!response.data || !response.data.routes || response.data.routes.length === 0) {
      console.error("OSRM API returned no routes:", response.data);
      return res.status(404).json({ error: "No route found" });
    }

    // Extract relevant data from the route
    const route = response.data.routes[0];
    const { distance, duration, geometry } = route;
    console.log("Route Geometry:", geometry);  // Log the geometry to see what you're getting

    // Send back the route data including distance, duration, and geometry in GeoJSON format
    res.status(200).json({
      distance: (distance / 1000).toFixed(2), // Convert to kilometers
      duration: (duration / 60).toFixed(2),  // Convert to minutes
      geometry: geometry                    // Geometry as GeoJSON
    });
  } catch (err) {
    console.error("Error during OSRM API request:", err.message);
    res.status(500).json({ error: "Error calculating route", details: err.message });
  }
});


// Start the Server
app.listen(PORT, () => {
 console.log(`Server running at http://localhost:${PORT}`);
});


