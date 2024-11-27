const express = require("express");
const { Client } = require("pg"); // <--- It's not needed, you are connecting with database from another file. It'd better to be removed.
// If you want to connect to database it would be better to use "const db = require("../util/db-connect");"

const OSRM = require("osrm"); // <-- It won't work. It's better to use OSRM API and you don't need package for it. It is better to be removed or you will receive error each time that module is not found.
const app = express(); // <-- It is used only in server.js. Can be removed here.
const PORT = 3000; // <-- It is used only in server.js. Can be removed here.
const osrm = new OSRM({
  path: "path/to/osrm-backend-data.osrm", // Path to your OSRM data
  algorithm: "MLD", // Multi-Level Dijkstra algorithm
}); // <-- It won't work. It is better to remove this "new OSRM" and everything connected to it.

// PostgreSQL client setup
const client = new Client({
  user: "salehalkarabubi",
  host: "localhost",
  database: "salehalkarabubi",
  password: "yourPassword",
  port: 5432,
}); // <--- It's not needed, you are connecting with database from another file. It'd better to be removed.

client.connect(); //<--- It's not needed, you are connecting with database from another file. It'd better to be removed.

const getLocationsFromDB = async () => {
  const result = await client.query(
    "SELECT name, latitude, longitude FROM locations"
  );
  return result.rows.map((row) => ({
    name: row.name,
    coords: [row.latitude, row.longitude],
  }));
}; //<--- It won't work like this. It should be fully rewritten or deleted completelly.

// Helper function to get coordinates for the best route
const getBestRouteCoordinates = (locations, bestRoute) => {
  return bestRoute
    .map((locationName) => {
      const location = locations.find((loc) => loc.name === locationName);
      return location ? location.coords : null;
    })
    .filter((coord) => coord !== null);
}; //<--- It won't work like this. It should be fully rewritten or deleted completelly.

// Define endpoint for best route calculation
app.get("/api/best-route", async (req, res) => {
  try {
    const locations = await getLocationsFromDB();
    const bestRoute = locations.map((loc) => loc.name); // Dummy logic for best route, replace with actual logic
    const coordinates = getBestRouteCoordinates(locations, bestRoute);
    const options = {
      coordinates: coordinates,
      overview: "full",
      geometries: "geojson",
    };

    osrm.route(options, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // Estimate time in minutes
      const estimatedTime = result.routes[0].duration / 60;
      res.json({
        route: result.routes[0].geometry.coordinates,
        estimatedTime: estimatedTime.toFixed(2), // returning estimated time in minutes
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); //<--- It won't work like this. It should be fully rewritten or deleted completelly.

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); // <-- It is used only in server.js. Can be removed here.
