const dotenv = require("dotenv/config");
const db = require("./util/db-connect.js");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const delivery = require("./routes/delivery.js");
// const { sequelize } = require("./config/database");
// const authRoutes = require("./routes/auth");
// const deliveryRoutes = require("./routes/delivery");
const tspService = require("./services/tspService.js");
// const { ClerkExpress } = require("@clerk/clerk-sdk-node");
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
// app.use(ClerkExpress(requireAuth));
app.get("/", async (req, res) => {
  try {
    const result = await db("users");
    console.log(tspService);
    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.send("Error");
  }
});

app.use("/delivery", delivery);
// Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/delivery", deliveryRoutes);

// Database and Server Initialization
// sequelize
//   .sync()
//   .then(() => {
//     console.log("Database connected");
//     app.listen(process.env.PORT || 3000, () =>
//       console.log(`Server running on port ${process.env.PORT || 3000}`)
//     );
//   })
//   .catch((err) => console.error("Error connecting to the database:", err));

//-----------

// const express = require('express');
// const pgp = require('pg-promise')();
// const path = require('path');

// // Set up the PostgreSQL connection
// const db = pgp({
//     host: 'localhost', // Change this if your database is hosted remotely
//     port: 5432,
//     database: 'your_database_name', // Replace with your database name
//     user: 'your_username', // Replace with your database username
//     password: 'your_password' // Replace with your database password
// });

// const app = express();
// const port = 3000;

// // Serve static files (like HTML, JS, CSS) from the "public" directory
// app.use(express.static('public'));

// // Endpoint to get the route (TSP solution)
// app.get('/getRoute', async (req, res) => {
//     try {
//         // Replace the array with the list of vertex IDs for your TSP query
//         const vertexIds = [1, 2, 3, 4]; // Example set of vertex IDs
//         const query = `
//             SELECT * FROM pgr_tsp(
//                 'SELECT id, source, target, cost, reverse_cost FROM edges',
//                 $1::int[]
//             ) AS route;
//         `;
//         const result = await db.any(query, [vertexIds]);

//         // Format the result into a simpler structure for the frontend
//         const route = result.map(r => ({
//             source: r.source,
//             target: r.target,
//             cost: r.cost,
//             edgeId: r.edge
//         }));

//         res.json(route); // Send the route as a JSON response
//     } catch (error) {
//         console.error('Error querying database:', error);
//         res.status(500).send('Error calculating the route');
//     }
// });

// // Start the server

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// const express = require('express');
// const { Client } = require('pg');
// const OSRM = require('osrm');
// const app = express();
// const PORT = process.env.PORT || 3001;

// const osrm = new OSRM({
//   path: 'path/to/osrm-backend-data.osrm', // Path to your OSRM data
//   algorithm: 'MLD' // Multi-Level Dijkstra algorithm
// });

// // PostgreSQL client setup
// const client = new Client({
//   user: 'yourUsername',
//   host: 'localhost',
//   database: 'yourDatabaseName',
//   password: 'yourPassword',
//   port: 5432
// });

// client.connect();

// const getLocationsFromDB = async () => {
//   const result = await client.query('SELECT name, latitude, longitude FROM locations');
//   return result.rows.map(row => ({
//     name: row.name,
//     coords: [row.latitude, row.longitude]
//   }));
// };

// // Helper function to get coordinates for the best route
// const getBestRouteCoordinates = (locations, bestRoute) => {
//   return bestRoute.map(locationName => {
//     const location = locations.find(loc => loc.name === locationName);
//     return location ? location.coords : null;
//   }).filter(coord => coord !== null);
// };

// // Define endpoint for best route calculation
// app.get('/api/best-route', async (req, res) => {
//   try {
//     const locations = await getLocationsFromDB();
//     const bestRoute = locations.map(loc => loc.name); // Dummy logic for best route, replace with actual logic
//     const coordinates = getBestRouteCoordinates(locations, bestRoute);
//     const options = {
//       coordinates: coordinates,
//       overview: 'full',
//       geometries: 'geojson'
//     };

//     osrm.route(options, (err, result) => {
//       if (err) {
//         res.status(500).json({ error: err.message });
//         return;
//       }

//       // Estimate time in minutes
//       const estimatedTime = result.routes[0].duration / 60;
//       res.json({
//         route: result.routes[0].geometry.coordinates,
//         estimatedTime: estimatedTime.toFixed(2) // returning estimated time in minutes
//       });
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
