const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    user = new User({
      name,
      email,
      passwordHash
    });

    await user.save();

    // Create JWT
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // HACKATHON MODE: Accept ANY email and password.
    // We fetch the first user in the database (created by the seed script)
    // so that the dashboard always loads the seeded LPG cylinders correctly.
    let user = await User.findOne();
    
    if (!user) {
      // Fallback just in case the DB wasn't seeded
      user = new User({
        name: 'Demo User',
        email: email || 'demo@example.com',
        passwordHash: 'mock_hash'
      });
      await user.save();
    }

    // Create JWT
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email } });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
