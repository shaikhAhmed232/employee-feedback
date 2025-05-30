const { body } = require('express-validator');
const { Category } = require("../models");
const mongoose = require('mongoose');

const categoryValidators = {
  create: [
    body('name')
      .notEmpty().withMessage('Category name is required')
      .bail()
      .isString().withMessage('Category name must be a string')
      .bail()
      .custom(async (value) => {
        const category = await Category.findOne({name: value});
        if (category) throw new Error(`Category ${value} already exists`);
        return true;
      })
      .trim(),
    body('description')
      .optional()
      .isString().withMessage('Description must be a string')
      .trim()
  ]
};

const feedbackValidators = {
  create: [
    body('feedback')
      .notEmpty().withMessage('Feedback text is required')
      .bail()
      .isString().withMessage('Feedback must be a string')
      .trim(),
    body('category')
      .notEmpty().withMessage('Category is required')
      .bail()
      .custom((value) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          throw new Error('Invalid category ID format');
        }
        return true;
      })
      .bail()
      .custom(async (value) => {
        const category = await Category.findById(value);
        if (!category) throw new Error('Category does not exist');
        return true;
      }),
    body('reviewed')
      .optional()
      .isBoolean().withMessage('Reviewed must be a boolean value')
  ],
  update: [
    body('feedback')
      .optional()
      .isString().withMessage('Feedback must be a string')
      .trim(),
    body('category')
      .optional()
      .custom((value) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          throw new Error('Invalid category ID format');
        }
        return true;
      })
      .bail()
      .custom(async (value) => {
        const category = await Category.findById(value);
        if (!category) throw new Error('Category does not exist');
        return true;
      }),
    body('reviewed')
      .optional()
      .isBoolean().withMessage('Reviewed must be a boolean value')
  ]
};

const registerValidation = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .bail()
    .isString().withMessage('Username must be a string')
    .trim(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .bail()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('name')
    .optional()
    .isString().withMessage('Name must be a string')
    .trim(),
  body('email')
    .optional()
    .isEmail().withMessage('Invalid email format')
    .trim()
];

const loginValidation = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .bail()
    .isString().withMessage('Username must be a string')
    .trim(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .bail()
    .isString().withMessage('Password must be a string')
];

module.exports = {
  categoryValidators,
  feedbackValidators,
  registerValidation,
  loginValidation
};