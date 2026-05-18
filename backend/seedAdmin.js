const User = require('./models/User');
const { init: initDb } = require('./db');

const seedAdmin = async () => {
  try {
    // Initialize database
    initDb();

    console.log('🔄 Checking for admin user...');

    const adminExists = await User.findOne({ email: 'admin@fakenews.com' });
    if (adminExists) {
      console.log('⚠️ Admin user already exists!');
      process.exit(0);
    }

    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@fakenews.com',
      password: 'adminpassword123',
      role: 'admin'
    });

    console.log('🎉 Admin user created successfully in SQLite!');
    console.log('-----------------------------------');
    console.log(`Email: admin@fakenews.com`);
    console.log('Password: adminpassword123');
    console.log('-----------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
