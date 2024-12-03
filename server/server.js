require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const axios = require("axios"); // For making HTTP requests to OSRM API
const db = require("./util/db-connect");
const addressesRoute = require("./routes/addresses");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// Set up multer for CSV uploads
const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
  res.status(200).send("Server is running");
});

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
app.post("/api/delivery", async (req, res) => {
  const { address, positionLatitude, positionLongitude } = req.body;

  if (!address || !positionLatitude || !positionLongitude) {
    return res.status(400).json({
      error:
        "Missing required fields. Please provide address, latitude, and longitude.",
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

// Upload CSV and Add Deliveries
app.post("/api/upload-csv", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;
  const deliveries = [];

  // Read CSV file
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      deliveries.push({
        address: row.address,
        position_latitude: parseFloat(row.position_latitude),
        position_longitude: parseFloat(row.position_longitude),
      });
    })
    .on("end", async () => {
      try {
        await db("deliveries").insert(deliveries);
        console.log(deliveries)
        res.status(200).json({ message: "CSV file processed and data saved." });
      } catch (err) {
        console.error("Error inserting CSV data:", err.message);
        res.status(500).json({
          error: "Failed to save CSV data to the database",
          details: err.message,
        });
      } finally {
        fs.unlinkSync(filePath); // Remove the temporary file
      }
    })
    .on("error", (err) => {
      console.error("Error processing CSV file:", err.message);
      res.status(500).json({
        error: "Failed to process CSV file",
        details: err.message,
      });
      fs.unlinkSync(filePath); // Remove the temporary file
    });
});

// Calculate Best Route (Updated for proper validation)
app.post("/api/best-route", async (req, res) => {
  const { locations } = req.body;

  // Ensure there are at least two valid locations
  if (!locations || locations.length < 2) {
    return res
      .status(400)
      .json({ error: "At least two locations are required." });
  }

  // Validate coordinates: ensure no null lat/lng

  const validLocations = locations.filter((loc) => loc.lat && loc.lng);

  if (validLocations.length < 2) {
    return res.status(400).json({
      error: "Invalid locations. All locations must have valid lat/lng values.",
    });
  }

  // Format coordinates for OSRM API
  const coordinates = validLocations
    .map((loc) => `${loc.lng},${loc.lat}`)
    .join(";");
  const osrmBaseUrl =
    process.env.OSRM_BASE_URL || "http://router.project-osrm.org";
  const apiUrl = `${osrmBaseUrl}/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;

  // Check if the response has valid routes

  try {
    const response = await axios.get(apiUrl);

    if (
      !response.data ||
      !response.data.routes ||
      response.data.routes.length === 0
    ) {
      console.error("No route found in OSRM response:", response.data);
      return res.status(404).json({ error: "No route found." });
    }

    const route = response.data.routes[0];
    const { distance, duration, geometry, legs } = route;
    // Convert duration to hours and minutes
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const durationFormatted = `${hours} hours and ${minutes} minutes`;

    // Process the route legs and create ordered locations with estimated times
    const orderedLocations = legs.map((leg, index) => {
      const startLocation = leg.steps[0]?.maneuver?.location || [];
      const endLocation =
        leg.steps[leg.steps.length - 1]?.maneuver?.location || [];

      return {
        address: validLocations[index]?.address || "Unknown",
        latitude: startLocation[1] || 0,
        longitude: startLocation[0] || 0,
        estimatedTime: `${Math.floor(leg.duration / 60)} minutes`,
      };
    });

    // Add the final destination location
    const finalLeg = legs[legs.length - 1];
    const finalEndLocation =
      finalLeg.steps[finalLeg.steps.length - 1]?.maneuver?.location || [];
    const finalDestination = {
      address: validLocations[validLocations.length - 1]?.address || "Unknown",
      latitude: finalEndLocation[1] || 0,
      longitude: finalEndLocation[0] || 0,
      estimatedTime: null,
    };
    orderedLocations.push(finalDestination);

    res.status(200).json({
      distance: (distance / 1000).toFixed(2), // Convert distance to kilometers
      duration: durationFormatted,
      orderedLocations,
      geometry,
    });
  } catch (err) {
    console.error("Error in calculating route:", err.message);
    res
      .status(500)
      .json({ error: "Failed to calculate route", details: err.message });
  }
});

// Edit Delivery
app.put("/api/delivery/:id", async (req, res) => {
  const { id } = req.params;
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({
      error: "Address cannot be empty.",
    });
  }

  try {
    const [updatedDelivery] = await db("deliveries")
      .where({ id })
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
app.delete("/api/delivery/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db("deliveries").where({ id }).del();
    res.status(200).json({ message: "Delivery deleted successfully" });
  } catch (err) {
    console.error("Error deleting delivery:", err.message);
    res.status(500).json({
      error: "Failed to delete delivery",
      details: err.message,
    });
  }
});



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
