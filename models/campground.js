const mongoose = require("mongoose");
const Review = require("./review");
const { Schema } = mongoose;

const imageSchema = new Schema({
  url: String,
  filename: String,
});

// To use cloudinary sizing images feature.
imageSchema.virtual("thumnailUrl").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

// To show virtuals when converting to json
const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new Schema({
  title: String,
  images: [imageSchema],
  price: Number,
  description: String,
  location: String,
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
},opts);

// Adding virtual to campground schema to use mapbox cluster map.
campgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return this.popUpMarkup = `<h5>${this.title}</h5> <p>${this.description.substring(0,20)}...</p> <a class='btn btn-sm btn-primary' href='/campgrounds/${this._id}'>show</a>`;
});

campgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

const Campground = mongoose.model("campground", campgroundSchema);

module.exports = Campground;
