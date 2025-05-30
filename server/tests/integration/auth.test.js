/**
 * Integration Tests for Authentication Endpoints
 */

const request = require('supertest');
const express = require('express');
const { User } = require('../../src/models');
const { clearDB } = require('../setup');

// Import the Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRouter = require('../../src/routes/auth');
app.use('/api/auth', authRouter);

// Import error handler middleware
const { errorHandler } = require('../../src/middlewares');
app.use(errorHandler);

describe('Authentication API Endpoints', () => {
  // Clear database before each test
  beforeEach(async () => {
    await clearDB();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        password: 'Password123!',
        name: 'Test User',
        email: 'test@example.com'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.status).toBe(true);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.username).toBe(userData.username);
      expect(response.body.data.user.password).toBeUndefined(); // Password should not be returned
    });

    it('should fail to register with missing required fields', async () => {
      const incompleteUserData = {
        username: 'testuser',
        // Missing password
        name: 'Test User',
        email: 'test@example.com'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(incompleteUserData)
        .expect(400);

      expect(response.body.status).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should fail to register with duplicate username', async () => {
      const userData = {
        username: 'duplicateuser',
        password: 'Password123!',
        name: 'Test User',
        email: 'test@example.com'
      };

      // Register first user successfully
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Try to register another user with same username
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.status).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      // Create a user first
      const userData = {
        username: 'loginuser',
        password: 'Password123!',
        name: 'Login User',
        email: 'login@example.com'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Now try to login
      const loginData = {
        username: 'loginuser',
        password: 'Password123!'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.status).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.token).toBeDefined();
    });

    it('should fail to login with incorrect password', async () => {
      // Create a user first
      const userData = {
        username: 'failloginuser',
        password: 'Password123!',
        name: 'Fail Login User',
        email: 'faillogin@example.com'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Try to login with wrong password
      const loginData = {
        username: 'failloginuser',
        password: 'WrongPassword!'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.status).toBe(false);
    });

    it('should fail to login with non-existent username', async () => {
      const loginData = {
        username: 'nonexistentuser',
        password: 'Password123!'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.status).toBe(false);
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should retrieve user profile with valid token', async () => {
      // Register a user to get a token
      const userData = {
        username: 'profileuser',
        password: 'Password123!',
        name: 'Profile User',
        email: 'profile@example.com'
      };

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData);

      const token = registerResponse.body.data.token;

      // Now get the profile using the token
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.status).toBe(true);
      expect(response.body.message).toBe('Profile retrieved successfully');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.username).toBe(userData.username);
    });

    it('should fail to retrieve profile without token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(401);

      expect(response.body.status).toBe(false);
    });

    it('should fail to retrieve profile with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalidtoken')
        .expect(401);

      expect(response.body.status).toBe(false);
    });
  });
});