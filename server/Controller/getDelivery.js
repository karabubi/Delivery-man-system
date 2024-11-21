function getDelivery(req, res) {
  // TODO: query data from database
  // e.g.:
  // select id ,source ,target ,cost ,reverse_cost
  // from public.edges
  // LIMIT 1000
  res.json({ success: true });
}

module.exports = getDelivery;
