/**
 * Test Setup for Employee Feedback Portal Backend
 * 
 * This file configures the testing environment for backend tests
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const dbConnector = require('../src/connections/dbConnector');

// Setup environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';

let mongoServer;

/**
 * Connect to an in-memory MongoDB instance for testing
 */
module.exports.setupDB = async () => {
  // Create a new MongoDB memory server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Override DB connection to use in-memory instance
  const originalConnect = mongoose.connect;
  mongoose.connect = jest.fn().mockImplementation(() => {
    return originalConnect(mongoUri, { useNewUrlParser: true });
  });
  
  // Connect to the in-memory database
  await dbConnector.connect();
};

/**
 * Clear all data in the in-memory database between tests
 */
module.exports.clearDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

/**
 * Close the database connection and MongoDB-Memory-Server after tests complete
 */
module.exports.closeDB = async () => {
  await dbConnector.disconnect();
  await mongoServer.stop();
};