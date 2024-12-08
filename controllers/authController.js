const User = require('../models/User');
const jwt = require('jwt-simple');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).send('User already exists');
    }

    user = new User({ username, email, password });
    await user.save();

    const payload = { userId: user._id };
    const token = jwt.encode(payload, process.env.JWT_SECRET);

    res.status(201).send({ token });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }

    const payload = { userId: user._id };
    const token = jwt.encode(payload, process.env.JWT_SECRET);

    res.status(200).send({ token });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

module.exports = { register, login };
