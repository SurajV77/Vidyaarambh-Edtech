const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI || mongoURI.includes('your_mongodb_connection_string')) {
      console.warn('⚠️ [Vidyaarambh DB Warning]: MONGO_URI is missing or placeholder in .env!');
      console.warn('⚠️ MongoDB connection paused. Please update server/.env with your MongoDB Atlas URI.');
      return;
    }

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ [MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ [MongoDB Connection Error]: ${error.message}`);
    console.error('💡 Tip: Verify your IP address is whitelisted (0.0.0.0/0) in MongoDB Atlas Network Access and your password is URL-encoded if it contains special characters.');
    // Keep process alive so dev server doesn't crash in local test mode
  }
};

module.exports = connectDB;
