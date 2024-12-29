
const db = require("../util/db-connect.js");

// Add Delivery
exports.addDelivery = async (req, res) => {
  const { userId, address, positionLatitude, positionLongitude } = req.body;

  try {
    const newDelivery = await db.query(
      "INSERT INTO deliveries (user_id, address, position_latitude, position_longitude) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, address, positionLatitude, positionLongitude]
    );
    res.status(201).json(newDelivery.rows[0]);
  } catch (err) {
    console.error('Error adding delivery:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get Deliveries
exports.getDeliveries = async (req, res) => {
  const userId = req.user.id;

  try {
    const deliveries = await db.query(
      "SELECT * FROM deliveries WHERE user_id = $1", 
      [userId]
    );
    res.json(deliveries.rows);
  } catch (err) {
    console.error('Error fetching deliveries:', err.message);
    res.status(500).json({ error: err.message });
  }
};
