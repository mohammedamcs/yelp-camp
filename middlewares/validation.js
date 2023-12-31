
// Class
const AppError = require("../helpers/AppError");


// Campground and review Validation Schema
const { campgroundSchema, reviewSchema } = require("../schemas");

// Validation Middleware
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((elm) => elm.message).join(",");
      throw new AppError(msg, 400);
    } else {
      next();
    }
  };
  
  // Validation middleware
  module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((elm) => elm.message).join(",");
      throw new AppError(msg, 400);
    } else {
      next();
    }
  };