const { Feedback } = require("../models");
const { httpStatusCode } = require("../utils/constants");
const { NotFoundError } = require("../utils/errors");

exports.getFeebacks = async (req, res, next) => {
    const { category } = req.query;
    const query = {};
    
    // Filter by category if provided
    if (category) {
        query.category = category;
    }
    
    const feedbacks = await Feedback.find(query).populate('category');
    res.status(httpStatusCode.OK)
        .json({
            status: true,
            message: "Successful",
            statusCode: httpStatusCode.OK,
            data: feedbacks
        })
}

exports.markFeedbackAsReviewed = async (req, res, next) => {
    const { feedbackId } = req.params;
    const feedback = await Feedback.findOne({_id: feedbackId});
    if (!feedback) throw new NotFoundError(`Feedback you are trying to mark as reviewed does not exist`);
    
    feedback.reviewed = true;
    await feedback.save();
    
    res.json({
        status: true,
        statusCode: httpStatusCode.OK,
        message: "Feedback marked as reviewed",
        data: feedback
    });
}

exports.createFeedback = async (req, res, next) => {
    const feedback = await Feedback.create(req.body);
    res.status(httpStatusCode.CREATED).json({
        status: true,
        message: "Feedback created successfully",
        statusCode: httpStatusCode.CREATED,
        data: feedback
    });
}

exports.deleteFeedback = async (req, res, next) => {
    const {feedbackId} = req.params;
    const feedback = await Feedback.findOne({_id: feedbackId});
    if (!feedback) throw new NotFoundError(`Feedback you are trying to delete does not exist`);
    await Feedback.deleteOne({_id: feedbackId});
    res.json({
        status: true,
        statusCode: httpStatusCode.OK,
        message: "Feedback deleted successfully",
    });
}