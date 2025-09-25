const express = require('express');
const apiRouter = express.Router();

// load routes
const thingsRouter = require('./things');

// Simple homepage for /api
apiRouter.all('/', (req, res) => {
  return res.status(200).json({ message: "Inventory API is running" });
});

// mount routers
apiRouter.use('/things', thingsRouter);

module.exports = apiRouter;