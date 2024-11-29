
const express = require('express');
const Delivery = require('../models/Delivery');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Add Delivery Information
router.post('/', authMiddleware, async (req, res) => {
  const { address, estimatedTime, route } = req.body;

  try {
    const delivery = await Delivery.create({
      postmanId: req.user.id,
      address,
      estimatedTime,
      route,
    });

    res.status(201).json({ message: 'Delivery information added', delivery });
  } catch (err) {
    res.status(400).json({ error: 'Error adding delivery information', details: err.message });
  }
});

// Get Deliveries for Current Postman
router.get('/', authMiddleware, async (req, res) => {
  try {
    const deliveries = await Delivery.findAll({ where: { postmanId: req.user.id } });
    res.status(200).json({ deliveries });
  } catch (err) {
    res.status(400).json({ error: 'Error fetching deliveries', details: err.message });
  }
});

// Update Delivery Information
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ where: { id: req.params.id, postmanId: req.user.id } });

    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

    // Extract and update fields
    const { address, estimatedTime, route, actualTime } = req.body;
    delivery.address = address || delivery.address;
    delivery.estimatedTime = estimatedTime || delivery.estimatedTime;
    delivery.route = route || delivery.route;
    delivery.actualTime = actualTime || delivery.actualTime;

    await delivery.save();

    res.status(200).json({ message: 'Delivery updated successfully', delivery });
  } catch (err) {
    res.status(400).json({ error: 'Error updating delivery', details: err.message });
  }
});

// Delete a Delivery
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ where: { id: req.params.id, postmanId: req.user.id } });

    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

    await delivery.destroy();

    res.status(200).json({ message: 'Delivery deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Error deleting delivery', details: err.message });
  }
});

module.exports = router;



