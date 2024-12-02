


require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const db = require("./util/db-connect");
const addressesRoute = require("./routes/addresses"); // Import the addresses route


const app = express();
const PORT = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(cors());


// Health Check Endpoint
app.get("/", (req, res) => {
 res.status(200).send("Server is running");
});


// Use the addresses route
app.use("/api/addresses", addressesRoute);


// Fetch All Deliveries
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


// Add Delivery
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


// Calculate Best Route
app.post("/api/best-route", async (req, res) => {
 const { locations } = req.body;


 if (!locations || locations.length < 2) {
   return res.status(400).json({ error: "At least two locations are required." });
 }


 const coordinates = locations.map((loc) => `${loc.lng},${loc.lat}`).join(";");
 const osrmBaseUrl = process.env.OSRM_BASE_URL || "http://router.project-osrm.org";
 const apiUrl = `${osrmBaseUrl}/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;


 try {
   const response = await axios.get(apiUrl);


   console.log("OSRM Response:", JSON.stringify(response.data, null, 2));


   if (!response.data || !response.data.routes || response.data.routes.length === 0) {
     console.error("No route found in OSRM response:", response.data);
     return res.status(404).json({ error: "No route found." });
   }


   const route = response.data.routes[0];
   const { distance, duration, geometry, legs } = route;


   console.log("Route Legs:", JSON.stringify(legs, null, 2)); // Log legs for debugging


   const hours = Math.floor(duration / 3600);
   const minutes = Math.floor((duration % 3600) / 60);
   const durationFormatted = `${hours} hours and ${minutes} minutes`;


   const orderedLocations = legs.map((leg, index) => {
     const startLocation = leg.steps[0]?.maneuver?.location || [];
     const endLocation = leg.steps[leg.steps.length - 1]?.maneuver?.location || [];


     console.log(`Leg ${index} Start Location:`, startLocation); // Debugging
     console.log(`Leg ${index} End Location:`, endLocation); // Debugging


     return {
       address: locations[index]?.address || "Unknown",
       latitude: startLocation[1] || 0, // Assuming [lng, lat] format
       longitude: startLocation[0] || 0, // Assuming [lng, lat] format
       estimatedTime: `${Math.floor(leg.duration / 60)} minutes`,
     };
   });


   const finalLeg = legs[legs.length - 1];
   const finalEndLocation = finalLeg.steps[finalLeg.steps.length - 1]?.maneuver?.location || [];
   const finalDestination = {
     address: locations[locations.length - 1]?.address || "Unknown",
     latitude: finalEndLocation[1] || 0, // Assuming [lng, lat] format
     longitude: finalEndLocation[0] || 0, // Assuming [lng, lat] format
     estimatedTime: null,
   };
   orderedLocations.push(finalDestination);


   res.status(200).json({
     distance: (distance / 1000).toFixed(2),
     duration: durationFormatted,
     orderedLocations,
     geometry,
   });
 } catch (err) {
   console.error("Error calculating route:", err.message);
   res.status(500).json({ error: "Failed to calculate route", details: err.message });
 }
});


app.listen(PORT, () => {
 console.log(`Server running at http://localhost:${PORT}`);
});


