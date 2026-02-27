const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey';

// Shop/Admin Login
router.post('/shop-login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' });

  try {
    const user = await User.findOne({ email }).populate('shop');
    if (!user || user.status !== 'ACTIVE') {
      return res.status(401).json({ message: 'Invalid credentials or inactive user' });
    }

    // Only SHOP_ADMIN or ADMIN allowed
    if (!['SHOP_ADMIN', 'ADMIN'].includes(user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }


    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        shop: user.shop || null
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
