/**
 * Integration Tests for Category Endpoints
 */

const request = require('supertest');
const express = require('express');
const { User, Category } = require('../../src/models');
const { clearDB } = require('../setup');

// Import the Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const categoryRouter = require('../../src/routes/category');
app.use('/api/category', categoryRouter);

// Import error handler middleware
const { errorHandler } = require('../../src/middlewares');
app.use(errorHandler);

// Helper to generate tokens
const jwt = require('jsonwebtoken');
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'test-jwt-secret',
    { expiresIn: '1h' }
  );
};

describe('Category API Endpoints', () => {
  let adminUser;
  let regularUser;
  let adminToken;
  let userToken;

  // Set up test data before each test
  beforeEach(async () => {
    await clearDB();
    
    // Create admin user
    adminUser = await User.create({
      username: 'admin',
      password: 'AdminPass123!',
      role: 'admin',
      name: 'Admin User',
      email: 'admin@example.com'
    });
    
    // Create regular user
    regularUser = await User.create({
      username: 'user',
      password: 'UserPass123!',
      role: 'user',
      name: 'Regular User',
      email: 'user@example.com'
    });
    
    // Generate tokens
    adminToken = generateToken(adminUser);
    userToken = generateToken(regularUser);

    // Create some initial categories
    await Category.create([
      { name: 'Category 1', description: 'Description for category 1' },
      { name: 'Category 2', description: 'Description for category 2' },
    ]);
  });

  describe('GET /api/category', () => {
    it('should retrieve all categories', async () => {
      const response = await request(app)
        .get('/api/category')
        .expect(200);

      expect(response.body.status).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0].name).toBeDefined();
      expect(response.body.data[0].description).toBeDefined();
    });

    it('should return an empty array when no categories exist', async () => {
      // Clear all categories
      await Category.deleteMany({});

      const response = await request(app)
        .get('/api/category')
        .expect(200);

      expect(response.body.status).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(0);
    });
  });

  describe('POST /api/category', () => {
    it('should allow admin to create a new category', async () => {
      const categoryData = {
        name: 'New Category',
        description: 'Description for the new category'
      };

      const response = await request(app)
        .post('/api/category')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(categoryData)
        .expect(201);

      expect(response.body.status).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.name).toBe(categoryData.name);
      expect(response.body.data.description).toBe(categoryData.description);

      // Verify it was actually created
      const createdCategory = await Category.findOne({ name: 'New Category' });
      expect(createdCategory).toBeDefined();
      expect(createdCategory.name).toBe('New Category');
    });

    it('should not allow regular users to create categories', async () => {
      const categoryData = {
        name: 'Unauthorized Category',
        description: 'This should not be created'
      };

      const response = await request(app)
        .post('/api/category')
        .set('Authorization', `Bearer ${userToken}`)
        .send(categoryData)
        .expect(403);

      expect(response.body.status).toBe(false);
      
      // Verify it was not created
      const category = await Category.findOne({ name: 'Unauthorized Category' });
      expect(category).toBeNull();
    });

    it('should fail to create category without authentication', async () => {
      const categoryData = {
        name: 'Unauthenticated Category',
        description: 'This should not be created'
      };

      const response = await request(app)
        .post('/api/category')
        // No authorization header
        .send(categoryData)
        .expect(401);

      expect(response.body.status).toBe(false);
      
      // Verify it was not created
      const category = await Category.findOne({ name: 'Unauthenticated Category' });
      expect(category).toBeNull();
    });

    it('should fail to create category with missing required fields', async () => {
      const incompleteData = {
        // Missing name
        description: 'Description without a name'
      };

      const response = await request(app)
        .post('/api/category')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(incompleteData)
        .expect(400);

      expect(response.body.status).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should fail to create category with duplicate name', async () => {
      // Try to create a category with a name that already exists
      const duplicateData = {
        name: 'Category 1', // Already exists from beforeEach
        description: 'Attempt to create duplicate category'
      };

      const response = await request(app)
        .post('/api/category')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(duplicateData)
        .expect(400);

      expect(response.body.status).toBe(false);
    });
  });
});