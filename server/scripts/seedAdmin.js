const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
  console.log('\n========================================');
  console.log('   VIDYAARAMBH - ADMIN INITIAL SEEDER    ');
  console.log('========================================\n');

  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, MONGO_URI } = process.env;

  if (!MONGO_URI || MONGO_URI.includes('your_mongodb_connection_string')) {
    console.error('❌ Error: MONGO_URI is not configured in server/.env.');
    console.error('👉 Please configure your MongoDB Atlas URI in server/.env before running seed:admin.');
    process.exit(1);
  }

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('❌ Error: ADMIN_EMAIL or ADMIN_PASSWORD missing from server/.env.');
    console.error('👉 Please define ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD in server/.env.');
    process.exit(1);
  }

  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB.');

    const cleanEmail = ADMIN_EMAIL.trim().toLowerCase();
    const cleanName = (ADMIN_NAME || 'Teacher Admin').trim();

    // Check if an admin with this email or role already exists
    let existingAdmin = await User.findOne({ email: cleanEmail });

    if (existingAdmin) {
      console.log(`ℹ️ Admin account with email [${cleanEmail}] already exists.`);
      console.log('🔄 Updating password and ensuring role is "admin"...');
      existingAdmin.name = cleanName;
      existingAdmin.password = ADMIN_PASSWORD; // Will be re-hashed by pre-save hook
      existingAdmin.role = 'admin';
      existingAdmin.isActive = true;
      await existingAdmin.save();
      console.log('🎉 Existing Admin successfully updated!');
    } else {
      console.log(`⏳ Creating initial Admin account for [${cleanEmail}]...`);
      const newAdmin = new User({
        name: cleanName,
        email: cleanEmail,
        password: ADMIN_PASSWORD, // Will be hashed by pre-save hook
        role: 'admin',
        isActive: true,
      });

      await newAdmin.save();
      console.log('🎉 Admin account created successfully!');
    }

    console.log('\n----------------------------------------');
    console.log(`👤 Admin Name     : ${cleanName}`);
    console.log(`📧 Admin Email    : ${cleanEmail}`);
    console.log(`🔑 Admin Password : [HIDDEN - Defined in server/.env]`);
    console.log(`🛡️ Role           : admin`);
    console.log('----------------------------------------');
    console.log('🚀 You can now start the server with: npm run dev');
    console.log('🌐 Then log in securely at: http://localhost:5173/admin/login\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Admin seeding failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();
