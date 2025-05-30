const { Router } = require("express");
const tryCatchWrapper = require("../utils/tryCatchWrapper");
const { validateRequest, authenticate, requireAdmin } = require("../middlewares");
const { getFeebacks, createFeedback, deleteFeedback, markFeedbackAsReviewed } = require("../controllers/feedback");
const { feedbackValidators } = require("../utils/validators");

const router = Router();

router.route("/")
    .get(tryCatchWrapper(getFeebacks))
    .post(
        validateRequest(feedbackValidators.create),
        tryCatchWrapper(createFeedback)
    );

router.route("/:feedbackId")
    .delete(
        authenticate,
        requireAdmin,
        tryCatchWrapper(deleteFeedback)
    );

router.route("/:feedbackId/reviewed")
    .patch( 
        authenticate,
        requireAdmin,
        tryCatchWrapper(markFeedbackAsReviewed)
    );

module.exports = router;