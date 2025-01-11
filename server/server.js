

require("dotenv").config();
const express = require("express");
const path = require("path");
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
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "build")));

// Set up multer for CSV uploads
const upload = multer({ dest: "uploads/" });

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).send("Server is running");
});

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
  const osrmBaseUrl = process.env.OSRM_BASE_URL || "http://router.project-osrm.org";
  const apiUrl = `${osrmBaseUrl}/trip/v1/driving/${coordinates}?roundtrip=true&geometries=geojson&steps=true`;

  try {
    const response = await axios.get(apiUrl);

    if (!response.data || !response.data.trips || response.data.trips.length === 0) {
      return res.status(404).json({ error: "No route found for the provided locations." });
    }

    const trip = response.data.trips[0];
    const waypoints = response.data.waypoints;

    if (!trip || !waypoints) {
      return res.status(404).json({ error: "No waypoints or trips found in OSRM response." });
    }

    const distanceInKm = (trip.distance / 1000).toFixed(2);
    const durationInHours = (trip.duration / 3600).toFixed(2);

    // Reorder locations based on waypoint indices
    const reorderedLocations = waypoints
      .sort((a, b) => a.waypoint_index - b.waypoint_index)
      .map((waypoint, index) => {
        const location = updatedLocations[waypoint.waypoint_index];
        return {
          order: index + 1,
          address: location?.address || waypoint.name || `Stop ${index + 1}`,
          coordinates: waypoint.location,
        };
      });

    // Prepare steps and handle zero durations
    const steps = trip.legs.map((leg, index) => {
      const from = reorderedLocations[index]?.address;
      const to = reorderedLocations[index + 1]?.address || "End";
      const duration = (leg.duration / 3600).toFixed(2);

      // Fallback for zero duration
      const safeDuration = duration > 0 ? duration : "0.01";

      return {
        from,
        to,
        distance: (leg.distance / 1000).toFixed(2) + " km",
        duration: `${safeDuration} hours`,
      };
    });

    // Enhance reordered locations with estimated times
    const orderedLocations = reorderedLocations.map((location, index) => {
      const step = steps[index - 1];
      return {
        ...location,
        estimatedTime: step ? step.duration : "0 hours",
      };
    });

    res.status(200).json({
      geometry: trip.geometry,
      orderedLocations,
      duration: durationInHours,
      distance: distanceInKm,
      steps,
    });
  } catch (err) {
    console.error("Error fetching best route:", err.message);
    res.status(500).json({ error: "Failed to fetch the best route.", details: err.message });
  }
});

// Add Delivery
app.post("/api/delivery", requireAuth(), async (req, res) => {
  const { address, positionLatitude, positionLongitude } = req.body;

  if (!address || !positionLatitude || !positionLongitude) {
    return res.status(400).json({ error: "Missing required fields: address, latitude, longitude." });
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
        const existingAddresses = await db("deliveries").where("user_id", userId).pluck("address");

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
    res.status(500).json({ error: "Error deleting deliveries.", details: err.message });
  }
});

// Catch-All Route for React Frontend
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
