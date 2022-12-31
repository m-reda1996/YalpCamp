const Reviews = require("../models/review")
const Campground = require("../models/campGround")

module.exports.createReview = async (req, res) => {
    const { body, rating } = req.body
    const campground = await Campground.findById(req.params.id)
    const review = new Reviews(req.body.review)
    review.author = req.user._id
    campground.review.push(review)
    await review.save()
    await campground.save()
    req.flash("success", "create new review  ")
    res.redirect(`/campground/${campground._id}`)
  }

  module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } })
    await Reviews.findByIdAndDelete(reviewId)
    req.flash("success", "deleted a review  ")
    res.redirect(`/campground/${id}`)
  }