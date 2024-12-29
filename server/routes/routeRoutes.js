
const express = require('express');
const axios = require('axios');
const polyline = require('@mapbox/polyline');
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");

const router = express.Router();

router.post('/best-route', ClerkExpressRequireAuth(), async (req, res) => {
  const { locations } = req.body;

  if (!locations || locations.length < 2) {
    return res.status(400).json({ error: "At least two locations are required." });
  }

  const coordinates = locations.map((loc) => `${loc.lng},${loc.lat}`).join(";");
  const osrmBaseUrl = process.env.OSRM_BASE_URL || "http://router.project-osrm.org";
  const osrmUrl = `${osrmBaseUrl}/route/v1/driving/${coordinates}?overview=full&geometries=polyline`;

  try {
    const response = await axios.get(osrmUrl);

    if (!response.data || !response.data.routes || response.data.routes.length === 0) {
      return res.status(404).json({ error: "No route found." });
    }

    const route = response.data.routes[0];
    const { distance, duration, geometry } = route;

    let coordinatesDecoded;
    try {
      coordinatesDecoded = polyline.decode(geometry);
    } catch (err) {
      console.error("Error decoding polyline:", err);
      return res.status(400).json({ error: "Failed to decode polyline geometry" });
    }

    if (!coordinatesDecoded || coordinatesDecoded.length === 0) {
      return res.status(400).json({ error: "Route geometry is missing or incomplete." });
    }

    const estimatedTime = (duration / 60).toFixed(2);
    const distanceInKm = (distance / 1000).toFixed(2);

    res.status(200).json({
      distance: distanceInKm,
      duration: estimatedTime,
      geometry: {
        type: "LineString",
        coordinates: coordinatesDecoded,
      },
    });
  } catch (err) {
    console.error("Error calculating route:", err.message);
    res.status(500).json({ error: "Failed to calculate route", details: err.message });
  }
});

module.exports = router;