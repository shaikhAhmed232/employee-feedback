/**
 * Integration Tests for Feedback Endpoints
 */

const request = require('supertest');
const express = require('express');
const { User, Category, Feedback } = require('../../src/models');
const { clearDB } = require('../setup');

// Import the Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const feedbackRouter = require('../../src/routes/feedback');
app.use('/api/feedback', feedbackRouter);

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

describe('Feedback API Endpoints', () => {
  let testCategory;
  let adminUser;
  let regularUser;
  let adminToken;
  let userToken;

  // Set up test data before each test
  beforeEach(async () => {
    await clearDB();
    
    // Create a test category
    testCategory = await Category.create({
      name: 'Test Category',
      description: 'A category for testing'
    });
    
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
  });

  describe('GET /api/feedback', () => {
    it('should retrieve all feedback when no filter is applied', async () => {
      // Create some test feedback items
      await Feedback.create([
        {
          feedback: 'Feedback 1',
          category: testCategory._id,
          anonymous: true
        },
        {
          feedback: 'Feedback 2',
          category: testCategory._id,
          anonymous: false
        }
      ]);

      const response = await request(app)
        .get('/api/feedback')
        .expect(200);

      expect(response.body.status).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0].feedback).toBeDefined();
      expect(response.body.data[0].category).toBeDefined();
    });

    it('should filter feedback by category', async () => {
      // Create another category
      const anotherCategory = await Category.create({
        name: 'Another Category',
        description: 'Another category for testing'
      });
      
      // Create test feedback items in different categories
      await Feedback.create([
        {
          feedback: 'Feedback in test category',
          category: testCategory._id,
          anonymous: true
        },
        {
          feedback: 'Feedback in another category',
          category: anotherCategory._id,
          anonymous: true
        }
      ]);

      // Request feedback filtered by test category
      const response = await request(app)
        .get(`/api/feedback?category=${testCategory._id}`)
        .expect(200);

      expect(response.body.status).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].feedback).toBe('Feedback in test category');
    });
  });

  describe('POST /api/feedback', () => {
    it('should create new feedback with valid data', async () => {
      const feedbackData = {
        feedback: 'This is a new feedback',
        category: testCategory._id.toString(),
        anonymous: true
      };

      const response = await request(app)
        .post('/api/feedback')
        .send(feedbackData)
        .expect(201);

      expect(response.body.status).toBe(true);
      expect(response.body.message).toBe('Feedback created successfully');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.feedback).toBe(feedbackData.feedback);
      expect(response.body.data.anonymous).toBe(true);
      expect(response.body.data.reviewed).toBe(false); // Default value
    });

    it('should fail to create feedback with missing required fields', async () => {
      const incompleteData = {
        // Missing feedback text
        category: testCategory._id.toString(),
        anonymous: true
      };

      const response = await request(app)
        .post('/api/feedback')
        .send(incompleteData)
        .expect(400);

      expect(response.body.status).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should fail to create feedback with invalid category', async () => {
      const invalidData = {
        feedback: 'This is a test feedback',
        category: 'invalidcategoryid',
        anonymous: true
      };

      const response = await request(app)
        .post('/api/feedback')
        .send(invalidData)
        .expect(400);

      expect(response.body.status).toBe(false);
    });
  });

  describe('DELETE /api/feedback/:feedbackId', () => {
    it('should allow admin to delete feedback', async () => {
      // Create a feedback to delete
      const feedback = await Feedback.create({
        feedback: 'Feedback to delete',
        category: testCategory._id,
        anonymous: true
      });

      const response = await request(app)
        .delete(`/api/feedback/${feedback._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.status).toBe(true);
      
      // Verify it was actually deleted
      const deletedFeedback = await Feedback.findById(feedback._id);
      expect(deletedFeedback).toBeNull();
    });

    it('should not allow non-admin users to delete feedback', async () => {
      // Create a feedback to delete
      const feedback = await Feedback.create({
        feedback: 'Feedback to delete',
        category: testCategory._id,
        anonymous: true
      });

      const response = await request(app)
        .delete(`/api/feedback/${feedback._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.status).toBe(false);
      
      // Verify it was not deleted
      const existingFeedback = await Feedback.findById(feedback._id);
      expect(existingFeedback).toBeDefined();
    });

    it('should fail to delete feedback without authentication', async () => {
      // Create a feedback
      const feedback = await Feedback.create({
        feedback: 'Feedback to delete',
        category: testCategory._id,
        anonymous: true
      });

      const response = await request(app)
        .delete(`/api/feedback/${feedback._id}`)
        // No authorization header
        .expect(401);

      expect(response.body.status).toBe(false);
    });

    it('should return 404 for non-existent feedback', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011'; // Valid but non-existent ObjectId

      const response = await request(app)
        .delete(`/api/feedback/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body.status).toBe(false);
    });
  });

  describe('PATCH /api/feedback/:feedbackId/reviewed', () => {
    it('should allow admin to mark feedback as reviewed', async () => {
      // Create a feedback
      const feedback = await Feedback.create({
        feedback: 'Feedback to review',
        category: testCategory._id,
        anonymous: true,
        reviewed: false
      });

      const response = await request(app)
        .patch(`/api/feedback/${feedback._id}/reviewed`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.status).toBe(true);
      expect(response.body.message).toBe('Feedback marked as reviewed');
      expect(response.body.data.reviewed).toBe(true);
      
      // Verify it was actually updated
      const updatedFeedback = await Feedback.findById(feedback._id);
      expect(updatedFeedback.reviewed).toBe(true);
    });

    it('should not allow non-admin users to mark feedback as reviewed', async () => {
      // Create a feedback
      const feedback = await Feedback.create({
        feedback: 'Feedback to review',
        category: testCategory._id,
        anonymous: true,
        reviewed: false
      });

      const response = await request(app)
        .patch(`/api/feedback/${feedback._id}/reviewed`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.status).toBe(false);
      
      // Verify it was not updated
      const existingFeedback = await Feedback.findById(feedback._id);
      expect(existingFeedback.reviewed).toBe(false);
    });

    it('should return 404 for non-existent feedback', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011'; // Valid but non-existent ObjectId

      const response = await request(app)
        .patch(`/api/feedback/${nonExistentId}/reviewed`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body.status).toBe(false);
    });
  });
});