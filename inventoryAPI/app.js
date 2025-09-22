const express = require('express');
const db = require('./db/mongoose');
const app = express();
const port = 3000;

const apiRouter = require('./routes/api');

app.use('/api', apiRouter);

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