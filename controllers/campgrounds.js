// Model
const Campground = require("../models/campground");

// Cloudinary
const { cloudinary } = require("../config/cloudinary");

// MapBox Geocoder To Store lat and long of location.
const { storeGeometry, updateGeometry } = require("../helpers/geometry");

// Show all campgrounds with pagination
module.exports.index = async (req, res, next) => {
  try {
    // Pagination
    const perPage = 12;
    const numberOfDocuments = await Campground.count();
    const numberOfPages = parseInt(numberOfDocuments / perPage);
    let page = req.query.page || 0;

    if (page > numberOfPages) {
      page = numberOfPages;
    }

    const campgrounds = await Campground.find()
      .limit(perPage)
      .skip(perPage * page);

    if (campgrounds.length)
      res.render("campgrounds/index", {
        campgrounds,
        numberOfPages,
        page,
      });
  } catch (err) {
    return next(err);
  }
};

// Show form to create new campground
module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

// Create new campground
module.exports.create = async (req, res, next) => {
  try {
    // Creating a new campground
    const newCampground = new Campground(req.body.campground);

    // Storing geometry info from mapbox geocoder
    await storeGeometry(newCampground, req.body.campground.location);

    // Adding images uploaded by the user, using multer and cloudinary help
    newCampground.images = req.files.map((file) => ({
      url: file.path,
      filename: file.filename,
    }));

    // Adding the creator of this campground before saving
    newCampground.creator = req.user._id;

    // Save campground
    await newCampground.save();

    // Flash success message to user
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${newCampground._id}`);
  } catch (err) {
    return next(err);
  }
};

// Show one campground based on id
module.exports.show = async (req, res, next) => {
  try {
    const { id } = req.params;

    const campground = await Campground.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "creator",
        },
      })
      .populate("creator");

    // if there is no campground with the specified id
    if (!campground) {
      req.flash("error", "No Campground Was Found!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  } catch (err) {
    return next(err);
  }
};

// Show form to update one campground
module.exports.renderUpdateForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // if there is no campground with the specified id
    if (!campground) {
      req.flash("error", "No Campground Was Found!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  } catch (err) {
    return next(err);
  }
};

// Update one campground
module.exports.update = async (req, res, next) => {
  try {
    const { campground, deleteImages } = req.body;
    const { id } = req.params;

    // Update geometry for campground
    await updateGeometry(id,campground.location);

    // User new uploaded images for campground
    const images = req.files.map((file) => ({
      url: file.path,
      filename: file.filename,
    }));

    // Update campground
    const updatedCampground = await Campground.findByIdAndUpdate(id, {
      $push: { images },
      ...campground,
    });

    // if user select images to delete
    if (deleteImages) {
      // First delete these images from cloudinary
      for (let filename of deleteImages) {
        cloudinary.uploader.destroy(filename);
      }
      // Second delete these images from campground
      await updatedCampground.updateOne({
        $pull: { images: { filename: { $in: deleteImages } } },
      });
    }

    req.flash("success", "Campground is successfully updated!");
    res.redirect(`/campgrounds/${id}`);
  } catch (err) {
    return next(err);
  }
};

// Delete one campground
module.exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id);
    // Delete images from cloudinary
    for (let { filename } of deletedCampground.images) {
      cloudinary.uploader.destroy(filename);
    }
    req.flash("success", "Campground is successfully deleted!");
    res.redirect("/campgrounds");
  } catch (err) {
    return next(err);
  }
};

// Show all campgrounds for cluster map
module.exports.clusterMapSrc = async (req, res, next) => {
  try {
    const campgrounds = await Campground.find();

    if (campgrounds.length){
       res.status(200).json(campgrounds)
    }else {
      throw new Error();
    }
  } catch (err) {
    res.status(500).json({msg:'Sorry try again later!'});
  }
};
