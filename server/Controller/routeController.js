

const axios = require('axios');

exports.getRoute = async (req, res) => {
  const { locations } = req.body;
  const userId = req.auth.userId;

  if (!locations || locations.length < 2) {
    return res.status(400).json({ error: 'At least two locations are required.' });
  }

  try {
    const coordinates = locations.map((loc) => `${loc.longitude},${loc.latitude}`).join(';');
    const baseUrl = process.env.OSRM_BASE_URL || 'http://router.project-osrm.org';
    const drivingUrl = `${baseUrl}/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;
    const walkingUrl = `${baseUrl}/route/v1/walking/${coordinates}?overview=full&geometries=geojson`;

    // Attempt to get driving route
    let response = await axios.get(drivingUrl);

    // If no driving route found, attempt to get walking route
    if (!response.data || !response.data.routes || response.data.routes.length === 0) {
      response = await axios.get(walkingUrl);
      if (!response.data || !response.data.routes || response.data.routes.length === 0) {
        return res.status(404).json({ error: 'No route found for driving or walking.' });
      }
    }

    const route = response.data.routes[0].geometry.coordinates;
    const distance = response.data.routes[0].distance;
    const duration = response.data.routes[0].duration;

    res.json({
      route,
      distance: (distance / 1000).toFixed(2), // Convert to kilometers
      duration: (duration / 60).toFixed(2), // Convert to minutes
    });
  } catch (err) {
    res.status(500).json({ error: 'Error calculating route', details: err.message });
  }
};