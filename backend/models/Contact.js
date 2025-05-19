const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  pinCode: {
    type: String,
    match: /^[1-9][0-9]{5}$/,
  },
});

const contactSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    match: /\S+@\S+\.\S+/,
  },
  phone: {
    type: String,
    match: /^[0-9]{10}$/,
  },
  addresses: [addressSchema],
});

module.exports = mongoose.model('Contact', contactSchema);
