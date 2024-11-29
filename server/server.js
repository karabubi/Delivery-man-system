
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const db = require("./util/db-connect");
const routeRoutes = require("./routes/routeRoutes");
const addressesRoute = require("./routes/addresses");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("Server is running");
});

app.use("/api/addresses", addressesRoute);
app.use("/route", routeRoutes);

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
      console.error("OSRM API returned no routes:", response.data);
      return res.status(404).json({ error: "No route found." });
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
      distance: (distance / 1000).toFixed(2),
      duration: (duration / 60).toFixed(2),
      legs,
      geometry,
    });
  } catch (err) {
    console.error("Error calculating route:", err.message);
    res.status(500).json({ error: "Failed to calculate route", details: err.message });
  }
});

app.post("/api/get-route", async (req, res) => {
  const { locations } = req.body;

  if (!locations || locations.length < 2) {
    return res.status(400).json({ error: "At least two locations are required." });
  }

  try {
    const coordinates = locations.map((loc) => `${loc.lng},${loc.lat}`).join(";");
    const osrmBaseUrl = process.env.OSRM_BASE_URL || "http://router.project-osrm.org";
    const osrmUrl = `${osrmBaseUrl}/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;
    const response = await axios.get(osrmUrl);

    if (!response.data || !response.data.routes || response.data.routes.length === 0) {
      console.error("OSRM API returned no routes:", response.data);
      return res.status(404).json({ error: "No route found" });
    }

    const route = response.data.routes[0];
    const { distance, duration, geometry } = route;
    console.log("Route Geometry:", geometry);

    res.status(200).json({
      distance: (distance / 1000).toFixed(2),
      duration: (duration / 60).toFixed(2),
      geometry: geometry,
    });
    console.log("Geometry", geometry);
  } catch (err) {
    console.error("Error during OSRM API request:", err.message);
    res.status(500).json({ error: "Error calculating route", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
