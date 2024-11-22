const axios = require('axios');

exports.getRoute = async (req, res) => {
  const { locations } = req.body;  // Array of coordinates

  try {
    const coordinates = locations.map(loc => `${loc.lng},${loc.lat}`).join(';');
    const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${coordinates}?overview=false`;

    const response = await axios.get(osrmUrl);
    res.json(response.data.routes[0].legs[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
