const { User } = require('../models');
const authService = require('../services/authService');
const { httpStatusCode } = require('../utils/constants');
const { NotFoundError } = require('../utils/errors');

exports.register = async (req, res, next) => {
  const result = await authService.register(req.body);
  
  res.status(httpStatusCode.CREATED).json({
    status: true,
    statusCode: httpStatusCode.CREATED,
    message: 'User registered successfully',
    data: {
      user: result.user,
      token: result.token
    }
  });
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  
  const result = await authService.login(username, password);
  
  res.status(httpStatusCode.OK).json({
    status: true,
    statusCode: httpStatusCode.OK,
    message: 'Login successful',
    data: {
      user: result.user,
      token: result.token
    }
  });
};

exports.getProfile = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    throw new NotFoundError('User not found');
  }
  
  res.status(httpStatusCode.OK).json({
    status: true,
    statusCode: httpStatusCode.OK,
    message: 'Profile retrieved successfully',
    data: user
  });
};

exports.createAdmin = async (req, res, next) => {
  req.body.role = 'admin';
  
  const result = await authService.register(req.body);
  
  res.status(httpStatusCode.CREATED).json({
    status: true,
    statusCode: httpStatusCode.CREATED,
    message: 'Admin user created successfully',
    data: {
      user: result.user,
      token: result.token
    }
  });
};