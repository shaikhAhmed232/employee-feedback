const { BaseError, ValidationError } = require("../utils/errors");
const { httpStatusCode, errorNames } = require("../utils/constants");

module.exports = async (error, req, res, next) => {
    if (error instanceof BaseError) {
        const response = {
            status: false,
            statusCode: error.statusCode,
            error: error.name,
            message: error.message,
        };
        if (error instanceof ValidationError ) response.details = error.errors;
        res.status(error.statusCode)
            .json(response);
        return;
    };
    console.error(`Internal server error occurred: `, error);
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({
            message: "Something went wrong"
        });
    return;
}


