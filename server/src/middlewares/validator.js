const { validationResult } = require('express-validator');
const { ValidationError } = require("../utils/errors")

module.exports = (validations) => {
    return async (req, res, next) => {
      await Promise.all(validations.map(validation => validation.run(req)));

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }));
  
        // Throw validation error
        next(new ValidationError(
            formattedErrors
        ));
        return;
      }
  
      return next();
    };
  };