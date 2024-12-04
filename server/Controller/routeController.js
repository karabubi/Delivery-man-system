
const axios = require("axios");
const { execSync } = require("child_process");

exports.getRoute = async (req, res) => {
  const { locations } = req.body;

  
  if (!locations || locations.length < 2) {
    return res.status(400).json({ error: "At least two locations are required." });
  }

  try {
    
    const commitHash = execSync("git rev-parse --short HEAD").toString().trim();

   
    console.log(`Handling request with commit hash: ${commitHash}`);

    
    const coordinates = locations
      .map((loc) => `${loc.longitude},${loc.latitude}`)
      .join(";");

    
    const osrmBaseUrl =
      process.env.OSRM_BASE_URL || "http://router.project-osrm.org";
    const osrmUrl = `${osrmBaseUrl}/trip/v1/driving/${coordinates}?overview=full`;

   
    const response = await axios.get(osrmUrl);

    
    if (
      !response.data ||
      !response.data.routes ||
      response.data.routes.length === 0
    ) {
      return res.status(404).json({ error: "No route found." });
    }

    
    const route = response.data.routes[0].geometry.coordinates; 
    const distance = response.data.routes[0].distance;
    const duration = response.data.routes[0].duration; 

    
    res.json({
      route,
      distance: (distance / 1000).toFixed(2),
      duration: (duration / 60).toFixed(2), 
      commitHash, 
      version: "1.0.0", 
    });
  } catch (err) {
    
    console.error("Error calculating route:", err.message);
    res
      .status(500)
      .json({ error: "Error calculating route", details: err.message });
  }
};
