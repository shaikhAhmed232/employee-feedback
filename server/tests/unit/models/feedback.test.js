/**
 * Unit Tests for Feedback Model
 */

const mongoose = require('mongoose');
const { Feedback, Category } = require('../../../src/models');
const { clearDB } = require('../../setup');

describe('Feedback Model Tests', () => {
  // Clear database and create a test category before each test
  let testCategory;

  beforeEach(async () => {
    await clearDB();
    
    // Create a test category that we can use for our feedback
    testCategory = await Category.create({
      name: 'Test Category',
      description: 'A category for testing'
    });
  });

  it('should create feedback successfully with valid data', async () => {
    const feedbackData = {
      feedback: 'This is a test feedback',
      category: testCategory._id,
      anonymous: true
    };

    const feedback = await Feedback.create(feedbackData);
    
    expect(feedback).toBeDefined();
    expect(feedback.feedback).toBe(feedbackData.feedback);
    expect(feedback.category.toString()).toBe(testCategory._id.toString());
    expect(feedback.anonymous).toBe(true);
    expect(feedback.reviewed).toBe(false); // Default value
  });

  it('should fail when feedback text is missing', async () => {
    const feedbackData = {
      category: testCategory._id,
      anonymous: true
    };

    await expect(Feedback.create(feedbackData)).rejects.toThrow();
  });

  it('should fail when category is missing', async () => {
    const feedbackData = {
      feedback: 'This is a test feedback',
      anonymous: true
    };

    await expect(Feedback.create(feedbackData)).rejects.toThrow();
  });

  it('should properly populate the category field', async () => {
    const feedbackData = {
      feedback: 'This is a test feedback',
      category: testCategory._id,
      anonymous: false
    };

    const feedback = await Feedback.create(feedbackData);
    const populatedFeedback = await Feedback.findById(feedback._id).populate('category');
    
    expect(populatedFeedback.category).toBeDefined();
    expect(populatedFeedback.category.name).toBe('Test Category');
    expect(populatedFeedback.category.description).toBe('A category for testing');
  });

  it('should set default values correctly', async () => {
    const feedbackData = {
      feedback: 'This is a test feedback',
      category: testCategory._id,
      // Not setting anonymous or reviewed to test defaults
    };

    const feedback = await Feedback.create(feedbackData);
    
    expect(feedback.reviewed).toBe(false); // Default should be false
    expect(feedback.anonymous).toBe(true); // Default should be true
  });

  it('should save timestamp fields correctly', async () => {
    const feedbackData = {
      feedback: 'This is a test feedback',
      category: testCategory._id,
    };

    const feedback = await Feedback.create(feedbackData);
    
    expect(feedback.created_at).toBeDefined();
    expect(feedback.updated_at).toBeDefined();
    expect(feedback.created_at instanceof Date).toBe(true);
    expect(feedback.updated_at instanceof Date).toBe(true);
  });

  it('should update the reviewed flag correctly', async () => {
    const feedbackData = {
      feedback: 'This is a test feedback',
      category: testCategory._id,
    };

    const feedback = await Feedback.create(feedbackData);
    expect(feedback.reviewed).toBe(false);
    
    // Update the reviewed status
    feedback.reviewed = true;
    await feedback.save();
    
    const updatedFeedback = await Feedback.findById(feedback._id);
    expect(updatedFeedback.reviewed).toBe(true);
  });
});