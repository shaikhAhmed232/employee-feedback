exports.httpStatusCode = {
    OK: 200,
    NOT_FOUND: 404,
    UN_AUTHORIZE: 401,
    FORBIDDEN: 403,
    INTERNAL_SERVER_ERROR: 500,
    CREATED: 201,
    BAD_REQUEST: 400,
}

exports.errorNames = {
    VALIDATION: "ValidationError",
    NOT_FOUND: "NotFoundError",
    UNAUTHORIZED: "UnauthorizedError",
    FORBIDDEN: "ForbiddenError"
}