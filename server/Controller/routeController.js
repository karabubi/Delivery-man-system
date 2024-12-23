
const axios = require('axios');

exports.getRoute = async (req, res) => {
  const { locations } = req.body;
  const userId = req.auth.userId;

  if (!locations || locations.length < 2) {
    return res.status(400).json({ error: 'At least two locations are required.' });
  }

  try {
    const coordinates = locations.map((loc) => `${loc.longitude},${loc.latitude}`).join(';');
    const osrmUrl = `${process.env.OSRM_BASE_URL || 'http://router.project-osrm.org'}/trip/v1/driving/${coordinates}?overview=full`;

    const response = await axios.get(osrmUrl);

    if (!response.data || !response.data.routes || response.data.routes.length === 0) {
      return res.status(404).json({ error: 'No route found.' });
    }

    const route = response.data.routes[0].geometry.coordinates;
    const distance = response.data.routes[0].distance;
    const duration = response.data.routes[0].duration;

    res.json({
      route,
      distance: (distance / 1000).toFixed(2),
      duration: (duration / 60).toFixed(2),
    });
  } catch (err) {
    res.status(500).json({ error: 'Error calculating route', details: err.message });
  }
};
