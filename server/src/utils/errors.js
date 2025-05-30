const {httpStatusCode, errorNames} = require("../utils/constants")
class BaseError extends Error {
    constructor (description, statusCode) {
        super(description);
        Object.setPrototypeOf(this, new.target.prototype)
        this.statusCode = statusCode;
        Error.captureStackTrace(this);
    }
}


class NotFoundError extends BaseError {
    constructor (description) {
        super(description, httpStatusCode.NOT_FOUND)
        this.name = errorNames.NOT_FOUND;
    }
}

class ValidationError extends BaseError {
    constructor(errors) {
      super('Validation Error', httpStatusCode.BAD_REQUEST);
      this.errors = errors;
      this.name = errorNames.VALIDATION;
    }
  }

class UnauthorizedError extends BaseError {
    constructor(description) {
        super(description, httpStatusCode.UN_AUTHORIZE);
        this.name = errorNames.UNAUTHORIZED;
    }
}

class ForbiddenError extends BaseError {
    constructor(description) {
        super(description, httpStatusCode.FORBIDDEN);
        this.name = errorNames.FORBIDDEN;
    }
}

module.exports = {
    BaseError,
    NotFoundError,
    ValidationError,
    UnauthorizedError,
    ForbiddenError
}