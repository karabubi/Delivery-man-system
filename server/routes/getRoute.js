// getRoute.js
const axios = require("axios");

const getRoute = async (req, res) => {
  const { locations } = req.body;

  if (!locations || locations.length < 2) {
    return res
      .status(400)
      .json({ error: "At least two locations are required." });
  }

  try {
    const coordinates = locations
      .map((loc) => `${loc.longitude},${loc.latitude}`)
      .join(";");
    const osrmBaseUrl =
      process.env.OSRM_BASE_URL || "http://router.project-osrm.org";
    const osrmUrl = `${osrmBaseUrl}/route/v1/driving/${coordinates}?overview=false`;
    const osrmUrlCopy = `${osrmBaseUrl}/trip/v1/driving/${coordinates}?overview=false`;

    const response = await axios.get(osrmUrl);
    const responseCopy = await axios.get(osrmUrl);
    console.log("response", response, "responseCopy", responseCopy);

    if (
      !response.data ||
      !response.data.routes ||
      response.data.routes.length === 0
    ) {
      return res.status(404).json({ error: "No route found." });
    }

    const route = response.data.routes[0].geometry.coordinates;
    res.json({ route });
  } catch (err) {
    res.status(500).json({ error: "Error calculating route" });
  }
};

module.exports = { getRoute };
