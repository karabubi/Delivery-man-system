
const { ClerkExpressRequireAuth } = require('@clerk/express');

const requireAuth = ClerkExpressRequireAuth({
  onError: (req, res) => {
    res.status(401).json({ error: 'Unauthorized' });
  },
});

module.exports = requireAuth;








