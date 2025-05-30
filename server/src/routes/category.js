const { Router } = require("express");
const tryCatchWrapper = require("../utils/tryCatchWrapper");
const {validateRequest, authenticate, requireAdmin} = require("../middlewares")
const { getCategories, createCategory } = require("../controllers/category");
const { categoryValidators } = require("../utils/validators");

const router = Router();

router.route("/")
    .get(tryCatchWrapper(getCategories))
    .post(
        authenticate,
        requireAdmin,
        validateRequest(categoryValidators.create),
        tryCatchWrapper(createCategory)
    );

module.exports = router;