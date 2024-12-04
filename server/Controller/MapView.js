const express = require('express');
const { Client } = require('pg');
const OSRM = require('osrm');
const app = express();
const PORT = 3000;

const osrm = new OSRM({
  path: 'path/to/osrm-backend-data.osrm', // Path to your OSRM data
  algorithm: 'MLD' // Multi-Level Dijkstra algorithm
});

// PostgreSQL client setup
const client = new Client({
  user: 'salehalkarabubi',
  host: 'localhost',
  database: 'salehalkarabubi',
  password: 'yourPassword',
  port: 5432
});

client.connect();

const getLocationsFromDB = async () => {
  const result = await client.query('SELECT name, latitude, longitude FROM locations');
  return result.rows.map(row => ({
    name: row.name,
    coords: [row.latitude, row.longitude]
  }));
};

// Helper function to get coordinates for the best route
const getBestRouteCoordinates = (locations, bestRoute) => {
  return bestRoute.map(locationName => {
    const location = locations.find(loc => loc.name === locationName);
    return location ? location.coords : null;
  }).filter(coord => coord !== null);
};

// Define endpoint for best route calculation
app.get('/api/best-route', async (req, res) => {
  try {
    const locations = await getLocationsFromDB();
    const bestRoute = locations.map(loc => loc.name); 
    const coordinates = getBestRouteCoordinates(locations, bestRoute);
    const options = {
      coordinates: coordinates,
      overview: 'full',
      geometries: 'geojson'
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
        estimatedTime: estimatedTime.toFixed(2) // returning estimated time in minutes
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
