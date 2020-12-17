const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
});

module.exports = mongoose.model('User', userSchema);
