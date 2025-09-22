const mongoose = require('mongoose');

// connect to DB
const db = mongoose.connect('mongodb://127.0.0.1:27017/inventory')

module.exports = db;