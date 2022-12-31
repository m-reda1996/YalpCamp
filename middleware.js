const Campground = require("./models/campGround")
const { campgroundSchema } = require("./schemes.js")
const ExpressEroor = require("./utils/ExpressError")
const {  reviewSchema } = require("./schemes.js")
const Reviews = require("./models/review")

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
  
    req.session.returnTo = req.originalUrl

    req.flash("error", "you must be signed in")
    return res.redirect("/login")
  }
  next()
}

module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body)
  if (error) {
    const msg = error.details.map((el) => el.message).join(",")
    throw new ExpressEroor(msg, 400)
  } else {
    next()
  }
}

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params
  const campground = await Campground.findById(id)
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!")
    return res.redirect(`/campground/${id}`)
  }
  next()
}
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id ,reviewId } = req.params
    const review = await Reviews.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
      req.flash("error", "You do not have permission to do that!")
      return res.redirect(`/campground/${id}`)
    }
    next()
  }

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
      const msg = error.details.map((el) => el.message).join(",")
      throw new ExpressEroor(msg, 400)
    } else {
      next()
    }
  }
  