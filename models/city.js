const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  city: String,
});

module.exports = mongoose.model('City', citySchema);
