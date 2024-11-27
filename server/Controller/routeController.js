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

const axios = require("axios");

exports.getRoute = async (req, res) => {
  const { locations } = req.body;

  try {
    const coordinates = locations
      .map((loc) => `${loc.longitude},${loc.latitude}`)
      .join(";");
    const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${coordinates}?overview=false`;

    const response = await axios.get(osrmUrl);
    const route = response.data.routes[0].geometry.coordinates; // <--- I am not sure what it will return.
    //Try console.log response without ".data.routes[0].geometry.coordinates;" first.

    res.json({ route });
  } catch (err) {
    res.status(500).json({ error: "Error calculating route" });
  }
}; // <--- Looks pretty close to what we want achieve, but it needs to be adjusted a bit.
// First of all you should use "trip" service instead of "route" in the link.
// In routes/routeRoutes.js the path is better to be changed from router.post("/route", getRoute); to router.post("/calculateRoute", getRoute);
// In the end you will receive a link like this: http://localhost:3000/route/calculateRoute
// that should return you information about specified route and the order of the route.
// Example: https://router.project-osrm.org/trip/v1/car/7.0916330978948805,50.744291858198075;9.945239,53.572983;6.962383932067491,50.9362477310649;8.78032208333333,53.06930259913838
