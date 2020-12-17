const mongoose = require('mongoose');

const goodSchema = new mongoose.Schema({
  name: String,
  img: String,
  price: Number,
  worn: Number,
  status: { type: String, default: 'в продаже' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
});

module.exports = mongoose.model('Good', goodSchema);
