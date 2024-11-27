// function getDelivery(req, res) {
//   // TODO: query data from database
//   // e.g.:
//   // select id ,source ,target ,cost ,reverse_cost
//   // from public.edges
//   // LIMIT 1000
//   res.json({ success: true });
// }

// module.exports = getDelivery;

const db = require("../util/db-connect.js");

// Add Delivery
exports.addDelivery = async (req, res) => {
  const { userId, address, positionLatitude, positionLongitude } = req.body;

  try {
    // ❗️❗️❗️It seems you are not using any of the values that you extracted from req.body above.
    // I would suggest to rewrite INSERT statement below like this:
    // `INSERT INTO deliveries (user_id, address, position_latitude, position_longitude) VALUES (${userId}, ${address}, ${positionLatitude}, ${positionLongitude}) RETURNING *`,
    // Line after that with [userId, address, positionLatitude, positionLongitude] could be removed.

    const newDelivery = await db.query(
      "INSERT INTO deliveries (user_id, address, position_latitude, position_longitude) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, address, positionLatitude, positionLongitude]
    );
    res.status(201).json(newDelivery.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Deliveries
exports.getDeliveries = async (req, res) => {
  const userId = req.user.id; // assuming authentication middleware is in place

  try {
    const deliveries = await db.query(
      "SELECT * FROM deliveries WHERE user_id = $1", // <--- ❗️❗️❗️ I'm not sure it will work. At least it will return delivaries only for one user.
      // You probably wanted to do `SELECT * FROM deliveries WHERE user_id = ${userID}`
      [userId] // <-- If i am correct above, than you should probaly remove this [userId] as well
    );
    res.json(deliveries.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
