const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
  body: String,
  rating: Number,
  creator:{
    type: Schema.Types.ObjectId,
    ref:'User'
  }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
