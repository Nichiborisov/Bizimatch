const Profile = require('../models/Profile');

exports.getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createProfile = async (req, res) => {
  const profile = new Profile({
    name: req.body.name,
    description: req.body.description,
    avatar: req.body.avatar
  });

  try {
    const newProfile = await profile.save();
    res.status(201).json(newProfile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
