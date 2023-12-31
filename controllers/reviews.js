// Models
const Review = require("../models/review");
const Campground = require("../models/campground");

// Create one review for a campground
module.exports.create = async (req, res, next) => {
  try {
    const [{ campground_id }, { review }] = [req.params, req.body];
    const campground = await Campground.findById(campground_id);

    // If there is no campground found
    if (!campground) {
      throw new Error("There is no campground with this id!", 404);
    }

    // Creating a new review
    const newReview = new Review(review);

    // Adding the creator of the review
    newReview.creator = req.user._id;

    // Saving the created review
    const savedReview = await newReview.save();

    // Adding the saved review to campground
    campground.reviews.push(savedReview);
    await campground.save();

    req.flash("success", "Successfully a new review is added!");
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (err) {
    return next(err);
  }
};

// Delete one review
module.exports.delete = async (req, res, next) => {
  try {
    const { campground_id, review_id } = req.params;
    await Campground.findByIdAndUpdate(campground_id, {
      $pull: { reviews: review_id },
    });
    await Review.findByIdAndDelete(review_id);

    req.flash("success", "Review is successfully deleted!");
    res.redirect(`/campgrounds/${campground_id}`);
  } catch (err) {
    return next(err);
  }
};
