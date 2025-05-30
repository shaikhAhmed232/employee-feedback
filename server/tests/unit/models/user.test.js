/**
 * Unit Tests for User Model
 */

const mongoose = require('mongoose');
const { User } = require('../../../src/models');
const { clearDB } = require('../../setup');
const bcrypt = require('bcryptjs');

describe('User Model Tests', () => {
  // Clear database before each test
  beforeEach(async () => {
    await clearDB();
  });

  it('should create a user successfully with valid data', async () => {
    const userData = {
      username: 'testuser',
      password: 'Password123!',
      role: 'user',
      name: 'Test User',
      email: 'test@example.com'
    };

    const user = await User.create(userData);
    
    expect(user).toBeDefined();
    expect(user.username).toBe(userData.username);
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
    expect(user.role).toBe('user');
    // Password should be hashed, not stored as plaintext
    expect(user.password).not.toBe(userData.password);
  });

  it('should fail when username is missing', async () => {
    const userData = {
      password: 'Password123!',
      role: 'user',
      name: 'Test User',
      email: 'test@example.com'
    };

    await expect(User.create(userData)).rejects.toThrow();
  });

  it('should fail when password is missing', async () => {
    const userData = {
      username: 'testuser',
      role: 'user',
      name: 'Test User',
      email: 'test@example.com'
    };

    await expect(User.create(userData)).rejects.toThrow();
  });

  it('should not allow duplicate usernames', async () => {
    const userData1 = {
      username: 'sameusername',
      password: 'Password123!',
      name: 'Test User 1',
      email: 'test1@example.com'
    };

    const userData2 = {
      username: 'sameusername',
      password: 'Password456!',
      name: 'Test User 2',
      email: 'test2@example.com'
    };

    await User.create(userData1);
    await expect(User.create(userData2)).rejects.toThrow();
  });

  it('should validate that role is either user or admin', async () => {
    const userData = {
      username: 'testuser',
      password: 'Password123!',
      role: 'invalidrole',
      name: 'Test User',
      email: 'test@example.com'
    };

    await expect(User.create(userData)).rejects.toThrow();
  });

  it('should correctly verify a password', async () => {
    const userData = {
      username: 'testuser',
      password: 'Password123!',
      name: 'Test User',
      email: 'test@example.com'
    };

    const user = await User.create(userData);
    const passwordMatch = await bcrypt.compare('Password123!', user.password);
    expect(passwordMatch).toBe(true);

    const wrongPasswordMatch = await bcrypt.compare('WrongPassword', user.password);
    expect(wrongPasswordMatch).toBe(false);
  });
});