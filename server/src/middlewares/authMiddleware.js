const { httpStatusCode } = require('../utils/constants');
const { BaseError, UnauthorizedError, ForbiddenError } = require('../utils/errors');
const authService = require('../services/authService');

exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication required');
    }

    const token = authHeader.split(' ')[1];
    
    const decoded = authService.verifyToken(token);
    
    // Add user info to request object
    req.user = decoded;
    
    next();
  } catch (error) {
    next(error);
  }
};

exports.requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    
    if (req.user.role !== 'admin') {
      throw new ForbiddenError('Admin access required');
    }
    
    next();
  } catch (error) {
    next(error);
  }
};