const express = require("express")
const review = require("../controllers/review")
const router = express.Router({ mergeParams: true })

const CatchAsync = require("../utils/CatchAsync")
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware")

router.post("/", validateReview, isLoggedIn, CatchAsync(review.createReview))
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, CatchAsync(review.deleteReview))

module.exports = router
