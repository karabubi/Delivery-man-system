// /Users/salehalkarabubi/works/project/Delivery-man-system/server/server.js

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const axios = require("axios");
const db = require("./util/db-connect");
const addressesRoute = require("./routes/addresses");
const { requireAuth } = require("@clerk/express");

const app = express();
const PORT = process.env.PORT || 5001;

// ----------------- MIDDLEWARE -----------------
app.use(bodyParser.json());

// CORS: allow local dev, Vercel and your custom domain
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://delivery-man-system.vercel.app",
      "https://delivery-man-system-git-main-karabubis-projects.vercel.app",
      "https://saleh-alkarabubi.site",
      "https://www.saleh-alkarabubi.site",
    ],
    credentials: true,
  })
);

// We do NOT serve a React build here because the frontend is on Vercel.
// (So no express.static('build') and no catch-all route.)

// Set up multer for CSV uploads
const upload = multer({ dest: "uploads/" });

// OSRM URLs
const osrmBaseUrl = process.env.OSRM_BASE_URL || "http://router.project-osrm.org";
const osrmRouteUrl = `${osrmBaseUrl}/route/v1/driving`;
const osrmTripUrl = `${osrmBaseUrl}/trip/v1/driving`;

// Helper Function to Convert Seconds to "hours and minutes" Format
const convertSecondsToHoursMinutes = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return `${hours} hr ${minutes} min`;
};

// Helper Function to Format Distance
const formatDistance = (distanceInKm) => {
  if (distanceInKm < 1) {
    const distanceInMeters = Math.round(distanceInKm * 1000);
    return `${distanceInMeters} m`;
  }
  return `${distanceInKm.toFixed(2)} km`;
};

// ----------------- HEALTH CHECK -----------------
app.get("/", (req, res) => {
  res.status(200).send("Delivery-man-system API is running");
});

// ----------------- ROUTES -----------------

// Protected Addresses Route
app.use("/api/addresses", requireAuth(), addressesRoute);

// Fetch All Deliveries
app.get("/api/delivery", requireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId;
    const deliveries = await db("deliveries").where("user_id", userId).select("*");
    const startCoordinates = { lat: 50.73743, lng: 7.098206 };

    if (!deliveries.length) {
      return res.status(404).json({ message: "No deliveries found." });
    }

    res.status(200).json({
      startCoordinates,
      deliveries,
    });
  } catch (err) {
    console.error("Error fetching deliveries:", err.message);
    res.status(500).json({ error: "Failed to fetch deliveries", details: err.message });
  }
});

// Calculate Best Route
app.post("/api/best-route", requireAuth(), async (req, res) => {
  const { locations } = req.body;

  if (!locations || locations.length < 1) {
    return res.status(400).json({ error: "At least one location is required." });
  }

  const startAndEndLocation = {
    address: "Adenauerallee 1",
    lat: 50.73743,
    lng: 7.098206,
  };

  const updatedLocations = [startAndEndLocation, ...locations, startAndEndLocation];
  const coordinates = updatedLocations.map((loc) => `${loc.lng},${loc.lat}`).join(";");

  try {
    // Step 1: Fetch Optimal Route (Trip API)
    const tripResponse = await axios.get(
      `${osrmTripUrl}/${coordinates}?roundtrip=true&geometries=geojson`
    );

    if (!tripResponse.data || !tripResponse.data.trips?.length) {
      return res.status(404).json({ error: "No route found." });
    }

    const trip = tripResponse.data.trips[0];
    const orderedIndices = tripResponse.data.waypoints.map((w) => w.waypoint_index);
    const reorderedLocations = orderedIndices.map((i) => updatedLocations[i]);

    // Step 2: Calculate Pairwise Travel Times and Distances (Route API)
    const routePromises = [];
    for (let i = 0; i < reorderedLocations.length - 1; i++) {
      const from = reorderedLocations[i];
      const to = reorderedLocations[i + 1];
      routePromises.push(
        axios.get(`${osrmRouteUrl}/${from.lng},${from.lat};${to.lng},${to.lat}?overview=false`)
      );
    }

    const routeResponses = await Promise.all(routePromises);

    const steps = routeResponses.map((routeRes, idx) => {
      const leg = routeRes.data.routes[0].legs[0];
      return {
        from: reorderedLocations[idx].address,
        to: reorderedLocations[idx + 1].address,
        distance: formatDistance(leg.distance / 1000),
        duration: convertSecondsToHoursMinutes(leg.duration),
      };
    });

    const totalDistanceInKm = steps.reduce(
      (sum, step) => sum + parseFloat(step.distance.split(" ")[0]),
      0
    );
    const totalDistance = formatDistance(totalDistanceInKm);

    const totalDurationInSeconds = routeResponses.reduce(
      (sum, routeRes) => sum + routeRes.data.routes[0].legs[0].duration,
      0
    );
    const totalDuration = convertSecondsToHoursMinutes(totalDurationInSeconds);

    res.status(200).json({
      geometry: trip.geometry,
      orderedLocations: reorderedLocations.map((loc, idx) => ({
        ...loc,
        estimatedTime: steps[idx]?.duration || "N/A",
      })),
      duration: totalDuration,
      distance: totalDistance,
      steps,
    });
  } catch (err) {
    console.error("Error calculating best route:", err.message);
    res.status(500).json({ error: "Failed to calculate the best route.", details: err.message });
  }
});

// Add Delivery
app.post("/api/delivery", requireAuth(), async (req, res) => {
  const { address, positionLatitude, positionLongitude } = req.body;

  if (!address || !positionLatitude || !positionLongitude) {
    return res
      .status(400)
      .json({ error: "Missing required fields: address, latitude, longitude." });
  }

  try {
    const userId = req.auth.userId;
    const existingDelivery = await db("deliveries").where({ address, user_id: userId }).first();

    if (existingDelivery) {
      return res.status(409).json({ error: "Duplicate delivery address." });
    }

    const [newDelivery] = await db("deliveries")
      .insert({
        address,
        position_latitude: positionLatitude,
        position_longitude: positionLongitude,
        user_id: userId,
      })
      .returning("*");

    res.status(201).json(newDelivery);
  } catch (err) {
    console.error("Error adding delivery:", err.message);
    res.status(500).json({ error: "Failed to add delivery", details: err.message });
  }
});

// Upload CSV and Add Deliveries
app.post("/api/upload-csv", requireAuth(), upload.single("file"), (req, res) => {
  const filePath = req.file.path;
  const deliveries = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      deliveries.push({
        address: row.address,
        position_latitude: parseFloat(row.latitude),
        position_longitude: parseFloat(row.longitude),
      });
    })
    .on("end", async () => {
      try {
        const userId = req.auth.userId;
        const existingAddresses = await db("deliveries")
          .where("user_id", userId)
          .pluck("address");

        const newDeliveries = deliveries.filter(
          (delivery) => !existingAddresses.includes(delivery.address)
        );

        if (!newDeliveries.length) {
          return res.status(409).json({ error: "All addresses in the file already exist." });
        }

        await db("deliveries").insert(
          newDeliveries.map((delivery) => ({ ...delivery, user_id: userId }))
        );

        res.status(200).json({ message: "CSV processed and deliveries added." });
      } catch (err) {
        console.error("Error inserting CSV data:", err.message);
        res.status(500).json({ error: "Failed to save CSV data.", details: err.message });
      } finally {
        fs.unlinkSync(filePath);
      }
    })
    .on("error", (err) => {
      console.error("Error processing CSV file:", err.message);
      fs.unlinkSync(filePath);
      res.status(500).json({ error: "Failed to process CSV file." });
    });
});

// Edit Delivery
app.put("/api/delivery/:id", requireAuth(), async (req, res) => {
  const { id } = req.params;
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: "Address cannot be empty." });
  }

  try {
    const userId = req.auth.userId;
    const [updatedDelivery] = await db("deliveries")
      .where({ id, user_id: userId })
      .update({ address })
      .returning("*");

    res.status(200).json(updatedDelivery);
  } catch (err) {
    console.error("Error updating delivery:", err.message);
    res.status(500).json({ error: "Failed to update delivery", details: err.message });
  }
});

// Delete Delivery
app.delete("/api/delivery/:id", requireAuth(), async (req, res) => {
  const { id } = req.params;

  try {
    const userId = req.auth.userId;
    await db("deliveries").where({ id, user_id: userId }).del();
    res.status(200).json({ message: "Delivery deleted successfully." });
  } catch (err) {
    console.error("Error deleting delivery:", err.message);
    res.status(500).json({ error: "Failed to delete delivery", details: err.message });
  }
});

// Delete All Deliveries
app.delete("/api/delete-all-deliveries", requireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId;
    await db("deliveries").where("user_id", userId).del();
    res.status(200).json({ message: "All deliveries deleted successfully." });
  } catch (err) {
    console.error("Error deleting deliveries:", err.message);
    res.status(500).json({ error: "Error deleting deliveries.", details: err.message });
  }
});

// ----------------- START SERVER -----------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


