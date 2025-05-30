const { User } = require('../models');

/**
 * This utility ensures that an admin user exists in the database
 * It creates a default admin user if none exists
 */
async function seedAdminUser() {
  try {
    // Check if an admin user already exists
    const adminExists = await User.findOne({ username: 'admin', role: 'admin' });
    
    if (!adminExists) {
      // Create default admin user
      const adminUser = await User.create({
        username: 'admin',
        password: 'admin123', // This will be hashed by the User model's pre-save middleware
        role: 'admin',
        name: 'Administrator',
        email: 'admin@example.com'
      });
      
      console.log('Default admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }

    return true;
  } catch (error) {
    console.error('Error seeding admin user:', error);
    throw error;
  }
}

module.exports = seedAdminUser;