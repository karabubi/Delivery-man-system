// const axios = require('axios');

// exports.getRoute = async (req, res) => {
//   const { locations } = req.body;  // Array of coordinates

//   try {
//     const coordinates = locations.map(loc => `${loc.lng},${loc.lat}`).join(';');
//     const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${coordinates}?overview=false`;

//     const response = await axios.get(osrmUrl);
//     res.json(response.data.routes[0].legs[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const axios = require('axios');

// exports.getRoute = async (req, res) => {
//   const { locations } = req.body;

//   try {
//     const coordinates = locations.map(loc => `${loc.longitude},${loc.latitude}`).join(';');
//     const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${coordinates}?overview=false`;

//     const response = await axios.get(osrmUrl);
//     const route = response.data.routes[0].geometry.coordinates;
//     res.json({ route });
//   } catch (err) {
//     res.status(500).json({ error: 'Error calculating route' });
//   }
// };
// ------------------28-11-24-1551

const axios = require("axios");

exports.getRoute = async (req, res) => {
  const { locations } = req.body;

  // Validate the input - Ensure that locations are provided and there's at least two locations
  if (!locations || locations.length < 2) {
    return res
      .status(400)
      .json({ error: "At least two locations are required." });
  }

  try {
    // Prepare coordinates in the format required by OSRM API (longitude,latitude)
    const coordinates = locations
      .map((loc) => `${loc.longitude},${loc.latitude}`)
      .join(";");

    // OSRM Base URL (default to public OSRM service if not provided)
    const osrmBaseUrl =
      process.env.OSRM_BASE_URL || "http://router.project-osrm.org";
    const osrmUrl = `${osrmBaseUrl}/trip/v1/driving/${coordinates}?overview=full`;

    // Request the route from OSRM API
    const response = await axios.get(osrmUrl);

    // Error handling: Ensure that a route is found in the response
    if (
      !response.data ||
      !response.data.routes ||
      response.data.routes.length === 0
    ) {
      return res.status(404).json({ error: "No route found." });
    }

    // Extract relevant information from the OSRM response
    const route = response.data.routes[0].geometry.coordinates; // Route geometry
    const distance = response.data.routes[0].distance; // Total route distance (in meters)
    const duration = response.data.routes[0].duration; // Total route duration (in seconds)

    //  let time = response.data.trips[0].legs.duration
    //  let hours = time / 60 / 60

    // Return the route geometry, total distance, and total duration
    res.json({
      route,
      distance: (distance / 1000).toFixed(2), // Distance in kilometers
      duration: (duration / 60).toFixed(2), // Duration in minutes
    });
  } catch (err) {
    // Enhanced error handling with more details for debugging
    console.error("Error calculating route:", err.message);
    res
      .status(500)
      .json({ error: "Error calculating route", details: err.message });
  }
};

// ------------------28-11-24-1551
