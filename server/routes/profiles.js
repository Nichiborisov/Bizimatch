const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  const { name, email, geoLocation, interests } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.geoLocation = geoLocation || user.geoLocation;
    user.interests = interests || user.interests;
    await user.save();

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Get profiles based on geoLocation or interests
router.get('/profiles', auth, async (req, res) => {
  const { geoLocation, interests } = req.query;

  try {
    let profiles;
    if (geoLocation) {
      profiles = await User.find({
        geoLocation: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(geoLocation.lng), parseFloat(geoLocation.lat)]
            },
            $maxDistance: 10000 // 10 km
          }
        }
      }).select('-password');
    } else if (interests) {
      profiles = await User.find({
        interests: { $in: interests.split(',') }
      }).select('-password');
    } else {
      profiles = await User.find().select('-password');
    }

    res.json({ profiles });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
