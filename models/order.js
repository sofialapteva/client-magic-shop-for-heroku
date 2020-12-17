const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  goods: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Good' }],
  createdAt: Date,
});

module.exports = mongoose.model('Order', orderSchema);
