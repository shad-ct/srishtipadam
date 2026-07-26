const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("../src/models/Admin");
const connectDB = require("../src/config/db");

const seedAdmin = async () => {
  try {
    await connectDB();

    const passwordHash = await bcrypt.hash("admin123", 10);

    await Admin.findOneAndUpdate(
      { username: "admin" },
      { username: "admin", passwordHash },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    );

    console.log("Admin user ready (username: admin, password: admin123)");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();