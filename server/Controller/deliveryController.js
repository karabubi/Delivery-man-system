// const Delivery = require('../models/Delivery');



// // Helper Function to Find Delivery
// const findDelivery = async (id, userId) => {
//  return Delivery.findOne({ where: { id, postmanId: userId } });
// };

// // Add Delivery
// exports.addDelivery = async (req, res) => {
//  const { address, estimatedTime, route } = req.body;

//  if (!address) return res.status(400).json({ error: 'Address is required.' });

//  try {
//    const delivery = await Delivery.create({
//      postmanId: req.auth.userId,
//      address,
//      estimatedTime,
//      route,
//    });
//    res.status(201).json({ message: 'Delivery added successfully.', delivery });
//  } catch (err) {
//    res.status(500).json({ error: 'Failed to add delivery.', details: err.message });
//  }
// };

// // Fetch All Deliveries
// exports.getDeliveries = async (req, res) => {
//  try {
//    const deliveries = await Delivery.findAll({ where: { postmanId: req.auth.userId } });
//    res.status(200).json({ deliveries });
//  } catch (err) {
//    res.status(500).json({ error: 'Failed to fetch deliveries.', details: err.message });
//  }
// };

// // Fetch Single Delivery
// exports.getDeliveryById = async (req, res) => {
//  try {
//    const delivery = await findDelivery(req.params.id, req.auth.userId);
//    if (!delivery) return res.status(404).json({ error: 'Delivery not found.' });

//    res.status(200).json({ delivery });
//  } catch (err) {
//    res.status(500).json({ error: 'Failed to fetch delivery.', details: err.message });
//  }
// };

// // Update Delivery
// exports.updateDelivery = async (req, res) => {
//  try {
//    const delivery = await findDelivery(req.params.id, req.auth.userId);
//    if (!delivery) return res.status(404).json({ error: 'Delivery not found.' });

//    const { address, estimatedTime, route, actualTime } = req.body;
//    Object.assign(delivery, { address, estimatedTime, route, actualTime });
//    await delivery.save();

//    res.status(200).json({ message: 'Delivery updated successfully.', delivery });
//  } catch (err) {
//    res.status(500).json({ error: 'Failed to update delivery.', details: err.message });
//  }
// };

// // Delete Delivery
// exports.deleteDelivery = async (req, res) => {
//  try {
//    const delivery = await findDelivery(req.params.id, req.auth.userId);
//    if (!delivery) return res.status(404).json({ error: 'Delivery not found.' });

//    await delivery.destroy();
//    res.status(200).json({ message: 'Delivery deleted successfully.' });
//  } catch (err) {
//    res.status(500).json({ error: 'Failed to delete delivery.', details: err.message });
//  }
// };

// // Calculate TSP
// exports.calculateTSPHandler = async (req, res) => {
//  try {
//    // Call the TSP calculation service
//    const result = await calculateTSP();

//    res.status(200).json({ message: 'TSP calculation successful', result });
//  } catch (err) {
//    console.error('Error in TSP calculation:', err.message);
//    res.status(500).json({ error: 'Failed to calculate TSP', details: err.message });
//  }
// };


//------------------------------22-12


const Delivery = require('../models/Delivery');
const { calculateTSP } = require('../services/tspService');

// Helper Function to Find Delivery
const findDelivery = async (id, userId) => {
  return Delivery.findOne({ where: { id, postmanId: userId } });
};

// Add Delivery
exports.addDelivery = async (req, res) => {
  const { address, estimatedTime, route } = req.body;

  if (!address) return res.status(400).json({ error: 'Address is required.' });

  try {
    const delivery = await Delivery.create({
      postmanId: req.auth.userId,
      address,
      estimatedTime,
      route,
    });
    res.status(201).json({ message: 'Delivery added successfully.', delivery });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add delivery.', details: err.message });
  }
};

// Fetch All Deliveries
exports.getDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.findAll({ where: { postmanId: req.auth.userId } });
    res.status(200).json({ deliveries });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch deliveries.', details: err.message });
  }
};

// Fetch Single Delivery
exports.getDeliveryById = async (req, res) => {
  try {
    const delivery = await findDelivery(req.params.id, req.auth.userId);
    if (!delivery) return res.status(404).json({ error: 'Delivery not found.' });

    res.status(200).json({ delivery });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch delivery.', details: err.message });
  }
};

// Update Delivery
exports.updateDelivery = async (req, res) => {
  try {
    const delivery = await findDelivery(req.params.id, req.auth.userId);
    if (!delivery) return res.status(404).json({ error: 'Delivery not found.' });

    const { address, estimatedTime, route, actualTime } = req.body;
    Object.assign(delivery, { address, estimatedTime, route, actualTime });
    await delivery.save();

    res.status(200).json({ message: 'Delivery updated successfully.', delivery });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update delivery.', details: err.message });
  }
};

// Delete Delivery
exports.deleteDelivery = async (req, res) => {
  try {
    const delivery = await findDelivery(req.params.id, req.auth.userId);
    if (!delivery) return res.status(404).json({ error: 'Delivery not found.' });

    await delivery.destroy();
    res.status(200).json({ message: 'Delivery deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete delivery.', details: err.message });
  }
};
