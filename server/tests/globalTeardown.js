/**
 * Global Teardown for Jest Tests
 * 
 * This file runs once after all tests complete
 */

const { closeDB } = require('./setup');

module.exports = async () => {
  console.log('Cleaning up test environment...');
  await closeDB();
  console.log('Test environment cleanup complete');
};