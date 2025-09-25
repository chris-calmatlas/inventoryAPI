const express = require('express');
const db = require('./db/mongoose');
const app = express();
const port = 3000;

// Import API routes
const apiRouter = require('./routes/api');

// Redirect root to /api
app.all('/', (req, res) => {
  return res.redirect('/api');
});

// Mount API routers
app.use('/api', apiRouter);

// Catchall for undefined routes and return a json object
app.use((req, res) => {
  return res.status(404).json({ error: 'Not Found' });
});

// Catchall error handler returns json object
app.use((err, req, res, next) => {
  console.error(err);
  return res.status(500).json({ error: 'Unknown error' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

db.then(() => {
    console.log('Connected to db');
  })
  .catch((error) => {
    console.error('Error connecting to db:', error);
  });

module.exports = app;