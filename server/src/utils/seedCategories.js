const mongoose = require('mongoose');
const { Category } = require('../models');
const dbConnector = require('../connections/dbConnector');

/**
 * This utility ensures the required categories exist in the database
 * Required categories: Work Environment, Leadership, Growth
 */
async function seedRequiredCategories() {
  try {
    const requiredCategories = [
      {
        name: 'Work Environment',
        description: 'Feedback related to workspace, facilities, and work atmosphere'
      },
      {
        name: 'Leadership',
        description: 'Feedback related to management, decision-making, and team leadership'
      },
      {
        name: 'Growth',
        description: 'Feedback related to learning opportunities, career development, and skill advancement'
      }
    ];

    let addedCount = 0;
    for (const category of requiredCategories) {
      const exists = await Category.findOne({ name: category.name });
      
      if (!exists) {
        await Category.create(category);
        console.log(`Added category: ${category.name}`);
        addedCount++;
      }
    }

    console.log(`Categories seeding complete. Added ${addedCount} new categories.`);
    
    return true;
  } catch (error) {
    console.error('Error seeding categories:', error);
    throw error;
  }
}

module.exports = seedRequiredCategories;