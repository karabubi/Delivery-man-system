// const { clerkMiddleware } = require('@clerk/nextjs/server');

// module.exports = clerkMiddleware();
// middleware/authMiddleware.js



const { ClerkExpressRequireAuth } = require('@clerk/express');

const requireAuth = ClerkExpressRequireAuth({
  onError: (req, res) => {
    res.status(401).json({ error: 'Unauthorized' });
  },
});

module.exports = requireAuth;