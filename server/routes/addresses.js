const express = require("express");
const axios = require("axios");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const db = require("../util/db-connect.js");

const generateSampleAddresses = async () => {
  const url = "https://nominatim.openstreetmap.org/search";
  const params = {
    city: "Bonn",
    country: "Germany",
    street: "",
    format: "json",
    limit: 100,
  };

  const addresses = [];
  for (let i = 1; i <= 100; i++) {
    params.street = `${i} Main St`;
    const response = await axios.get(url, { params });
    if (response.data.length) {
      const { display_name, lat, lon } = response.data[0];
      addresses.push({
        street: display_name,
        city: "Bonn",
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      });
    }
  }
  return addresses;
};

// Generate and Save Sample Addresses
router.post("/generate", async (req, res) => {
  try {
    const addresses = await generateSampleAddresses();
    // Assuming you're using Knex, save bulk addresses to the database
    await knex("locations").insert(addresses);
    res.status(201).json({
      message: "Sample addresses generated and saved successfully",
      addresses,
    });
  } catch (err) {
    res.status(400).json({
      error: "Error generating sample addresses",
      details: err.message,
    });
  }
});

// Route to get all addresses from the database
router.get("/addresses", async (req, res) => {
  try {
    const addresses = await getAllAddresses(); // Fetch addresses using the Knex function
    res.status(200).json({ addresses });
  } catch (err) {
    res
      .status(400)
      .json({ error: "Error fetching addresses", details: err.message });
  }
});

// Function to fetch all addresses from PostgreSQL
const getAllAddresses = async () => {
  try {
    const addresses = await db("locations").select(
      "address",
      "latitude",
      "longitude"
    );
    console.log(addresses);
    return addresses;
  } catch (err) {
    console.error("Error fetching addresses:", err);
    throw new Error("Unable to fetch addresses");
  }
};

// Route to get all addresses from the database
router.get("/", async (req, res) => {
  try {
    const addresses = await getAllAddresses();
    res.status(200).json({ addresses });
  } catch (err) {
    res
      .status(400)
      .json({ error: "Error fetching addresses", details: err.message });
  }
});

module.exports = router;
