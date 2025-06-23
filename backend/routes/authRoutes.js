const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { registerSchema, loginSchema } = require('../validators/authValidators');



const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      const messages = parsed.error.errors.map(e => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }

    const { email, username, password } = parsed.data;

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const newUser = new User({ email, username, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      const messages = parsed.error.errors.map(e => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }

    const { username, password } = parsed.data;

    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      username: user.username,
      email: user.email
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
