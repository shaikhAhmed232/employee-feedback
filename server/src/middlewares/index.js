const errorHandler = require("./errorHandler");
const validateRequest = require("./validator");
const { authenticate, requireAdmin } = require("./authMiddleware");

module.exports = {
    errorHandler,
    validateRequest,
    authenticate,
    requireAdmin,
}