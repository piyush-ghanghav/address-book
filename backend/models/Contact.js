const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    enum: ['Home', 'Office', 'Other']
  },
  customTitle: {
    type: String,
    required: function() {
      return this.title === 'Other';
    }
  },
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
    unique: true, 
    required: true
  },
  phone: {
    type: String,
    match: /^[0-9]{10}$/,
  },
  addresses: [addressSchema],
});

module.exports = mongoose.model('Contact', contactSchema);
