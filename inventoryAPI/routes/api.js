const express = require('express');
const apiRouter = express.Router();

const thingsRouter = require('./api/things');

// Mount routers
apiRouter.use('/things', thingsRouter);

module.exports = apiRouter;
