/**
 * Unit Tests for Category Model
 */

const mongoose = require('mongoose');
const { Category } = require('../../../src/models');
const { clearDB } = require('../../setup');

describe('Category Model Tests', () => {
  // Clear database before each test
  beforeEach(async () => {
    await clearDB();
  });

  it('should create a category successfully with valid data', async () => {
    const categoryData = {
      name: 'Test Category',
      description: 'This is a test category description'
    };

    const category = await Category.create(categoryData);
    
    expect(category).toBeDefined();
    expect(category.name).toBe(categoryData.name);
    expect(category.description).toBe(categoryData.description);
  });

  it('should fail when name is missing', async () => {
    const categoryData = {
      description: 'This is a test category description'
    };

    await expect(Category.create(categoryData)).rejects.toThrow();
  });

  it('should not allow duplicate category names', async () => {
    const categoryData1 = {
      name: 'Same Category Name',
      description: 'First category with this name'
    };

    const categoryData2 = {
      name: 'Same Category Name',
      description: 'Second category with same name'
    };

    await Category.create(categoryData1);
    await expect(Category.create(categoryData2)).rejects.toThrow();
  });

  it('should retrieve all categories correctly', async () => {
    const categories = [
      { name: 'Category 1', description: 'Description 1' },
      { name: 'Category 2', description: 'Description 2' },
      { name: 'Category 3', description: 'Description 3' }
    ];

    // Create all categories
    await Promise.all(categories.map(cat => Category.create(cat)));
    
    // Retrieve all categories
    const retrievedCategories = await Category.find();
    
    expect(retrievedCategories.length).toBe(3);
    expect(retrievedCategories[0].name).toBeDefined();
    expect(retrievedCategories[0].description).toBeDefined();
  });

  it('should trim whitespace from category name', async () => {
    const categoryData = {
      name: '  Category With Whitespace  ',
      description: 'This category has whitespace in the name'
    };

    const category = await Category.create(categoryData);
    expect(category.name).toBe('Category With Whitespace');
  });

  it('should find a category by name', async () => {
    const categoryData = {
      name: 'Searchable Category',
      description: 'This category should be findable by name'
    };

    await Category.create(categoryData);
    
    const foundCategory = await Category.findOne({ name: 'Searchable Category' });
    expect(foundCategory).toBeDefined();
    expect(foundCategory.name).toBe('Searchable Category');
  });

  it('should update a category correctly', async () => {
    const categoryData = {
      name: 'Initial Name',
      description: 'Initial description'
    };

    const category = await Category.create(categoryData);
    
    // Update the category
    category.name = 'Updated Name';
    category.description = 'Updated description';
    await category.save();
    
    const updatedCategory = await Category.findById(category._id);
    expect(updatedCategory.name).toBe('Updated Name');
    expect(updatedCategory.description).toBe('Updated description');
  });
});