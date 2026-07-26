require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const { connectCloudinary } = require('./src/config/cloudinary');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to DB and Cloudinary
  if (process.env.MONGO_URI) {
    await connectDB();
  } else {
    console.warn("MONGO_URI not set. Skipping DB connection.");
  }

  if (process.env.CLOUDINARY_CLOUD_NAME) {
    connectCloudinary();
  } else {
    console.warn("Cloudinary credentials not set. Skipping Cloudinary config.");
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
