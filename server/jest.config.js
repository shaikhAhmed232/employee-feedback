/**
 * Jest Configuration for Employee Feedback Portal Backend Tests
 */

module.exports = {
  // The root of your source code
  rootDir: './',
  
  // The test environment
  testEnvironment: 'node',
  
  // Specify the file extensions to consider as test files
  testMatch: ['**/__tests__/**/*.js', '**/*.test.js', '**/*.spec.js'],
  
  // Specify directories to ignore during test discovery
  testPathIgnorePatterns: ['/node_modules/', '/client/'],
  
  // Set up coverage measurement
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/utils/seedCategories.js',
    '!src/utils/seedAdminUser.js',
    '!**/node_modules/**',
  ],
  coverageDirectory: 'coverage',
  
  // Set up test timeouts (in milliseconds)
  testTimeout: 30000,
  
  // Verbose output
  verbose: true,
  
  // Set up global setup/teardown scripts
  globalSetup: './tests/globalSetup.js',
  globalTeardown: './tests/globalTeardown.js',
};