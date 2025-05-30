/**
 * Global Setup for Jest Tests
 * 
 * This file runs once before all tests start
 */

const { setupDB } = require('./setup');

module.exports = async () => {
  console.log('Setting up test environment...');
  await setupDB();
  console.log('Test database connected and ready');
};