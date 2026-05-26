const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('\n❌ MongoDB Connection Error:');
    console.error(`   ${error.message}\n`);
    console.error('📋 Please ensure MongoDB is installed and running:');
    console.error('   1. Install MongoDB from: https://www.mongodb.com/try/download/community');
    console.error('   2. Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas');
    console.error('   3. See MONGODB_INSTALLATION.md for detailed instructions\n');
    console.error('⚠️  Server will exit. Please install MongoDB and try again.\n');
    process.exit(1);
  }
};

module.exports = connectDatabase;

// Made with Bob
