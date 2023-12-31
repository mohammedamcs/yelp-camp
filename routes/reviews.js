const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn, isReviewCreator } = require("../middlewares/auth");
const { validateReview } = require("../middlewares/validation");

// Controllers
const reviews = require("../controllers/reviews");

// Review Routes
router.post("/", isLoggedIn, validateReview, reviews.create);

router.delete("/:review_id", isLoggedIn, isReviewCreator, reviews.delete);

module.exports = router;
