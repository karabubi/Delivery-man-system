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

// ✅ CORS (Vercel + custom domain + local)
const allowedOrigins = [
  "http://localhost:5173",
  "https://delivery-man-system.vercel.app",
  "https://delivery-man-system-git-main-karabubis-projects.vercel.app",
  "https://saleh-alkarabubi.site",
  "https://www.saleh-alkarabubi.site",
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  })
);

// Set up multer for CSV uploads
const upload = multer({ dest: "uploads/" });

// OSRM URLs
const osrmBaseUrl = process.env.OSRM_BASE_URL || "http://router.project-osrm.org";
const osrmRouteUrl = `${osrmBaseUrl}/route/v1/driving`;
const osrmTripUrl = `${osrmBaseUrl}/trip/v1/driving`;

// Helpers
const convertSecondsToHoursMinutes = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return `${hours} hr ${minutes} min`;
};

const formatDistance = (distanceInKm) => {
  if (distanceInKm < 1) return `${Math.round(distanceInKm * 1000)} m`;
  return `${distanceInKm.toFixed(2)} km`;
};

// ✅ NEW: Ensure Clerk user exists in DB (prevents FK error on deliveries.user_id)
async function ensureUserRow(req) {
  const userId = req?.auth?.userId;
  if (!userId) return;

  await db("users")
    .insert({ id: userId })
    .onConflict("id")
    .ignore();
}

// ----------------- HEALTH CHECK -----------------
app.get("/", (req, res) => {
  res.status(200).send("Delivery-man-system API is running");
});

// Optional: DB health check
app.get("/health/db", async (req, res) => {
  try {
    await db.raw("select 1 as ok");
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// ----------------- ROUTES -----------------

// Protected Addresses Route
app.use("/api/addresses", requireAuth(), addressesRoute);

// Fetch All Deliveries
app.get("/api/delivery", requireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId;

    const deliveries = await db("deliveries")
      .where("user_id", userId)
      .select("*")
      .orderBy("id", "asc");

    const startCoordinates = { lat: 50.73743, lng: 7.098206 };

    return res.status(200).json({ startCoordinates, deliveries });
  } catch (err) {
    console.error("Error fetching deliveries:", err);
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
    const tripResponse = await axios.get(
      `${osrmTripUrl}/${coordinates}?roundtrip=true&geometries=geojson`
    );

    if (!tripResponse.data || !tripResponse.data.trips?.length) {
      return res.status(404).json({ error: "No route found." });
    }

    const trip = tripResponse.data.trips[0];
    const orderedIndices = tripResponse.data.waypoints.map((w) => w.waypoint_index);
    const reorderedLocations = orderedIndices.map((i) => updatedLocations[i]);

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

    const totalDurationInSeconds = routeResponses.reduce(
      (sum, routeRes) => sum + routeRes.data.routes[0].legs[0].duration,
      0
    );

    res.status(200).json({
      geometry: trip.geometry,
      orderedLocations: reorderedLocations.map((loc, idx) => ({
        ...loc,
        estimatedTime: steps[idx]?.duration || "N/A",
      })),
      duration: convertSecondsToHoursMinutes(totalDurationInSeconds),
      distance: formatDistance(totalDistanceInKm),
      steps,
    });
  } catch (err) {
    console.error("Error calculating best route:", err);
    res.status(500).json({ error: "Failed to calculate the best route.", details: err.message });
  }
});

// Add Delivery
app.post("/api/delivery", requireAuth(), async (req, res) => {
  const { address, positionLatitude, positionLongitude } = req.body;

  if (!address || positionLatitude == null || positionLongitude == null) {
    return res.status(400).json({
      error: "Missing required fields: address, latitude, longitude.",
    });
  }

  try {
    // ✅ NEW: make sure users row exists before inserting deliveries
    await ensureUserRow(req);

    const userId = req.auth.userId;

    const existing = await db("deliveries")
      .where({ address, user_id: userId })
      .first();

    if (existing) {
      return res.status(409).json({ error: "Duplicate delivery address." });
    }

    const [newDelivery] = await db("deliveries")
      .insert({
        address,
        position_latitude: Number(positionLatitude),
        position_longitude: Number(positionLongitude),
        user_id: userId,
      })
      .returning("*");

    res.status(201).json(newDelivery);
  } catch (err) {
    console.error("Error adding delivery:", err);
    res.status(500).json({ error: "Failed to add delivery", details: err.message });
  }
});

// Upload CSV and Add Deliveries
app.post("/api/upload-csv", requireAuth(), upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });

  const filePath = req.file.path;
  const deliveries = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      deliveries.push({
        address: row.address,
        position_latitude: Number(row.latitude),
        position_longitude: Number(row.longitude),
      });
    })
    .on("end", async () => {
      try {
        // ✅ NEW: make sure users row exists before inserting deliveries
        await ensureUserRow(req);

        const userId = req.auth.userId;

        const existingAddresses = await db("deliveries")
          .where("user_id", userId)
          .pluck("address");

        const newDeliveries = deliveries
          .filter(
            (d) =>
              d.address &&
              !Number.isNaN(d.position_latitude) &&
              !Number.isNaN(d.position_longitude)
          )
          .filter((d) => !existingAddresses.includes(d.address));

        if (!newDeliveries.length) {
          return res.status(409).json({
            error: "All addresses in the file already exist (or invalid rows).",
          });
        }

        await db("deliveries").insert(newDeliveries.map((d) => ({ ...d, user_id: userId })));

        res.status(200).json({ message: "CSV processed and deliveries added." });
      } catch (err) {
        console.error("Error inserting CSV data:", err);
        res.status(500).json({ error: "Failed to save CSV data.", details: err.message });
      } finally {
        try {
          fs.unlinkSync(filePath);
        } catch {}
      }
    })
    .on("error", (err) => {
      console.error("Error processing CSV file:", err);
      try {
        fs.unlinkSync(filePath);
      } catch {}
      res.status(500).json({ error: "Failed to process CSV file." });
    });
});

// Edit Delivery
app.put("/api/delivery/:id", requireAuth(), async (req, res) => {
  const { id } = req.params;
  const { address } = req.body;

  if (!address) return res.status(400).json({ error: "Address cannot be empty." });

  try {
    const userId = req.auth.userId;

    const [updated] = await db("deliveries")
      .where({ id, user_id: userId })
      .update({ address })
      .returning("*");

    res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating delivery:", err);
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
    console.error("Error deleting delivery:", err);
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
    console.error("Error deleting deliveries:", err);
    res.status(500).json({ error: "Error deleting deliveries.", details: err.message });
  }
});

// ----------------- START SERVER -----------------
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
