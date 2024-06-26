const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  geoLocation: {
    type: { type: String, default: 'Point' },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  },
  interests: {
    type: [String]
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;

