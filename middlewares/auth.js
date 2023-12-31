// Models
const Campground = require("../models/campground");
const Review = require("../models/review");

// Authorization Middlware
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in!");
    return res.redirect("/login");
  }
  next();
};

// Authorization Middlware
module.exports.isCreator = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.creator.equals(req.user._id)) {
    req.flash("error", "You don't have the permision to do this operation!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

// Authorization Middlware
module.exports.isReviewCreator = async (req, res, next) => {
  const { campground_id, review_id } = req.params;
  const review = await Review.findById(review_id);
  if (!review.creator.equals(req.user._id)) {
    req.flash("error", "You don't have the permision to do this operation!");
    return res.redirect(`/campgrounds/${campground_id}`);
  }
  next();
};