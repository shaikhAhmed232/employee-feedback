const { Category } = require("../models");
const { httpStatusCode } = require("../utils/constants")

exports.getCategories = async (req, res, next) => {
    const categories = await Category.find({});
    res.status(httpStatusCode.OK)
        .json({
            status: true,
            message: "Successful",
            statusCode: httpStatusCode.OK,
            data: categories
        });
}

exports.createCategory = async (req, res, next) => {
    const body = req.body;
    const category = await Category.create(body);
    res.status(httpStatusCode.CREATED)
        .json({
            status: true,
            statusCode: httpStatusCode.CREATED,
            message: "Successfull",
            data: category
        })
}