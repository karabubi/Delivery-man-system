

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
const {
  ClerkExpressRequireAuth,
  clerkClient,
} = require("@clerk/clerk-sdk-node");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "build")));

// Set up multer for CSV uploads
const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
  res.status(200).send("Server is running");
});

// Protect addresses route
app.use("/api/addresses", ClerkExpressRequireAuth(), addressesRoute);

// Fetch All Deliveries with Starting Coordinates for Adenauerallee 1
app.get("/api/delivery", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId;
    console.log("userId", userId);

    const deliveries = await db("deliveries")
      .where("user_id", userId)
      .select("*");

    const startCoordinates = {
      lat: 50.73743,
      lng: 7.098206,
    };

    if (deliveries.length === 0) {
      return res.status(404).json({ message: "No deliveries found." });
    }

    res.status(200).json({
      startCoordinates,
      deliveries,
    });
  } catch (err) {
    console.error("Error fetching deliveries:", err.message);
    res.status(500).json({
      error: "Failed to fetch deliveries",
      details: err.message,
    });
  }
});

// Add Delivery
app.post("/api/delivery", ClerkExpressRequireAuth(), async (req, res) => {
  const { address, positionLatitude, positionLongitude } = req.body;

  if (!address || !positionLatitude || !positionLongitude) {
    return res.status(400).json({
      error:
        "Missing required fields. Please provide address, latitude, and longitude.",
    });
  }

  try {
    const userId = req.auth.userId;
    const existingDelivery = await db("deliveries")
      .where({ address, user_id: userId })
      .first();

    if (existingDelivery) {
      return res.status(409).json({
        error: "Duplicate delivery address. This address already exists.",
      });
    }

    const [newDelivery] = await db("deliveries")
      .insert({
        address,
        position_latitude: positionLatitude,
        position_longitude: positionLongitude,
        user_id: userId,
      })

      .returning("*");
    console.log("User saleh ID:", user_id);

    res.status(201).json(newDelivery);
  } catch (err) {
    console.error("Error adding delivery:", err.message);
    res.status(500).json({
      error: "Failed to add delivery",
      details: err.message,
    });
  }
});

// Upload CSV and Add Deliveries
app.post(
  "/api/upload-csv",
  ClerkExpressRequireAuth(),
  upload.single("file"),
  async (req, res) => {
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
        console.log("Deliveries:", deliveries);
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

          if (newDeliveries.length === 0) {
            return res.status(409).json({
              error: "All addresses in the uploaded file already exist.",
            });
          }

          await db("deliveries").insert(
            newDeliveries.map((delivery) => ({ ...delivery, user_id: userId }))
          );
          res
            .status(200)
            .json({ message: "CSV file processed and data saved." });
        } catch (err) {
          console.error("Error inserting CSV data:", err.message);
          res
            .status(500)
            .json({ error: "Failed to save CSV data to the database" });
        } finally {
          fs.unlinkSync(filePath);
        }
      })
      .on("error", (err) => {
        console.error("Error processing CSV file:", err.message);
        res.status(500).json({ error: "Failed to process CSV file" });
        fs.unlinkSync(filePath);
      });
  }
);

// Calculate Best Route (Driving and fallback to Walking)
app.post("/api/best-route", ClerkExpressRequireAuth(), async (req, res) => {
  const { locations } = req.body;

  if (!locations || locations.length < 1) {
    return res
      .status(400)
      .json({ error: "At least one location is required." });
  }

  const startAndEndLocation = {
    address: "Adenauerallee 1",
    lat: 50.73743,
    lng: 7.098206,
  };

  const updatedLocations = [
    startAndEndLocation,
    ...locations,
    startAndEndLocation,
  ];

  const validLocations = updatedLocations.filter((loc) => loc.lat && loc.lng);
  if (validLocations.length < 2) {
    return res.status(400).json({
      error: "Invalid locations. All locations must have valid lat/lng values.",
    });
  }

  const coordinates = validLocations
    .map((loc) => `${loc.lng},${loc.lat}`)
    .join(";");
  const osrmBaseUrl =
    process.env.OSRM_BASE_URL || "http://router.project-osrm.org";
  const drivingApiUrl = `${osrmBaseUrl}/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;
  const walkingApiUrl = `${osrmBaseUrl}/route/v1/walking/${coordinates}?overview=full&geometries=geojson`;

  try {
    let response = await axios.get(drivingApiUrl);

    if (
      !response.data ||
      !response.data.routes ||
      response.data.routes.length === 0
    ) {
      console.warn("No driving route found. Attempting walking route.");
      response = await axios.get(walkingApiUrl);
    }

    if (
      !response.data ||
      !response.data.routes ||
      response.data.routes.length === 0
    ) {
      return res
        .status(404)
        .json({ error: "No route found for driving or walking." });
    }

    const route = response.data.routes[0];
    const { distance, duration, geometry, legs } = route;

    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const durationFormatted = `${hours} hours and ${minutes} minutes`;

    const orderedLocations = [];
    legs.forEach((leg, index) => {
      const startLocation = leg.steps[0]?.maneuver?.location || [];
      const endLocation =
        leg.steps[leg.steps.length - 1]?.maneuver?.location || [];
      const adjustedDuration = leg.duration + 900;

      if (index === 0) {
        orderedLocations.push({
          address: validLocations[index]?.address || "Unknown",
          latitude: startLocation[1] || 0,
          longitude: startLocation[0] || 0,
          estimatedTime: `${Math.floor(adjustedDuration / 60)} minutes`,
        });
      }

      orderedLocations.push({
        address: validLocations[index + 1]?.address || "Unknown",
        latitude: endLocation[1] || 0,
        longitude: endLocation[0] || 0,
        estimatedTime: `${Math.floor(adjustedDuration / 60)} minutes`,
      });
    });

    res.status(200).json({
      distance: (distance / 1000).toFixed(2),
      duration: durationFormatted,
      orderedLocations,
      geometry,
    });
  } catch (err) {
    console.error("Error in calculating route:", err.message);
    res
      .status(500)
      .json({ error: "Failed to calculate route.", details: err.message });
  }
});

// Edit Delivery
app.put("/api/delivery/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const { id } = req.params;
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({
      error: "Address cannot be empty.",
    });
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
    res.status(500).json({
      error: "Failed to update delivery",
      details: err.message,
    });
  }
});

// Delete Delivery
app.delete("/api/delivery/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const { id } = req.params;

  try {
    const userId = req.auth.userId;
    await db("deliveries").where({ id, user_id: userId }).del();
    res.status(200).json({ message: "Delivery deleted successfully" });
  } catch (err) {
    console.error("Error deleting delivery:", err.message);
    res.status(500).json({
      error: "Failed to delete delivery",
      details: err.message,
    });
  }
});

// Delete All Deliveries
app.delete(
  "/api/delete-all-deliveries",
  ClerkExpressRequireAuth(),
  async (req, res) => {
    try {
      const userId = req.auth.userId;
      await db("deliveries").where("user_id", userId).del();
      res.status(200).send({ message: "All deliveries deleted" });
    } catch (err) {
      res.status(500).send({ error: "Error deleting deliveries" });
    }
  }
);

// Catch-all route for React
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
