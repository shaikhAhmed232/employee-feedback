const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { ValidationError, UnauthorizedError } = require('../utils/errors');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

exports.generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      username: user.username,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

exports.register = async (userData) => {
  const existingUser = await User.findOne({ username: userData.username });
  if (existingUser) {
    throw new ValidationError([{ field: 'username', message: 'Username already taken' }]);
  }
  const user = await User.create(userData);
  const token = this.generateToken(user);

  user.password = undefined;
  
  return { user, token };
};

exports.login = async (username, password) => {
  const user = await User.findOne({ username }).select('+password');
  
  if (!user || !(await user.comparePassword(password))) {
    throw new UnauthorizedError('Invalid username or password');
  }
  
  const token = this.generateToken(user);
  
  user.password = undefined;
  
  return { user, token };
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired token');
  }
};