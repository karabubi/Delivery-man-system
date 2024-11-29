
const express = require("express");
const axios = require("axios");

const router = express.Router();

// Route calculation using OSRM
router.post("/calculate", async (req, res) => {
    const { locations } = req.body;

    if (!locations || locations.length < 2) {
        return res.status(400).json({ error: "At least two locations are required." });
    }

    // Prepare coordinates in the required format
    const coordinates = locations.map(loc => `${loc.lng},${loc.lat}`).join(";");

    const osrmBaseUrl = process.env.OSRM_BASE_URL || "http://router.project-osrm.org";
    const apiUrl = `${osrmBaseUrl}/route/v1/driving/${coordinates}?overview=full`;

    try {
        const response = await axios.get(apiUrl);

        if (!response.data || !response.data.routes || response.data.routes.length === 0) {
            return res.status(404).json({ error: "No route found." });
        }

        const route = response.data.routes[0];
        const { distance, duration, geometry } = route;

        const legs = route.legs.map((leg, index) => ({
            legNumber: index + 1,
            distance: leg.distance,
            duration: leg.duration,
            summary: leg.summary,
        }));

        res.status(200).json({
            distance,
            duration,
            legs,
            geometry,
        });
    } catch (err) {
        console.error("Error calculating route:", err.message);
        res.status(500).json({ error: "Failed to calculate route", details: err.message });
    }
});

module.exports = router;
