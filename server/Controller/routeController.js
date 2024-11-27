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


const axios = require('axios');

exports.getRoute = async (req, res) => {
  const { locations } = req.body;

  try {
    const coordinates = locations.map(loc => `${loc.longitude},${loc.latitude}`).join(';');
    const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${coordinates}?overview=false`;

    const response = await axios.get(osrmUrl);
    const route = response.data.routes[0].geometry.coordinates;
    res.json({ route });
  } catch (err) {
    res.status(500).json({ error: 'Error calculating route' });
  }
};
