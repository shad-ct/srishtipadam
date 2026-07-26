const Admin = require('../models/Admin');
const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });

  if (admin && (await bcrypt.compare(password, admin.passwordHash))) {
    const token = generateToken(admin._id);
    
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.json({
      _id: admin._id,
      username: admin.username,
    });
  } else {
    res.status(401);
    throw new Error('Invalid username or password');
  }
});

const logout = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    _id: req.admin._id,
    username: req.admin.username,
  });
});

module.exports = { login, logout, getMe };
