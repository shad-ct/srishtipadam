require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('../src/models/Admin');
const connectDB = require('../src/config/db');

const seedAdmin = async () => {
  try {
    await connectDB();
    
    // Check if admin exists
    const existing = await Admin.findOne({ username: 'admin' });
    if (existing) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash('admin123', 10);
    const admin = new Admin({
      username: 'admin',
      passwordHash
    });

    await admin.save();
    console.log('Admin user created successfully (username: admin, password: admin123)');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
