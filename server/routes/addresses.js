
const express = require("express");
const axios = require("axios");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const router = express.Router();
const db = require("../util/db-connect.js");

// Generate and Save Sample Addresses
router.post("/generate", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId;
    const addresses = await generateSampleAddresses();
    // Assuming you're using Knex, save bulk addresses to the database
    await db("locations").insert(
      addresses.map(address => ({ ...address, user_id: userId }))
    );
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
router.get("/addresses", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId;
    const addresses = await getAllAddresses(userId); // Fetch addresses using the Knex function
    res.status(200).json({ addresses });
  } catch (err) {
    res.status(400).json({ error: "Error fetching addresses", details: err.message });
  }
});

// Function to fetch all addresses from PostgreSQL
const getAllAddresses = async (userId) => {
  try {
    const addresses = await db("locations")
      .where("user_id", userId)
      .select("address", "latitude", "longitude");
    return addresses;
  } catch (err) {
    console.error("Error fetching addresses:", err);
    throw new Error("Unable to fetch addresses");
  }
};

// Route to get all addresses from the database
router.get("/", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId;
    const addresses = await getAllAddresses(userId);
    res.status(200).json({ addresses });
  } catch (err) {
    res.status(400).json({ error: "Error fetching addresses", details: err.message });
  }
});

module.exports = router;