const express = require("express");
const router = express.Router();
const { isLoggedIn, isCreator,  } = require("../middlewares/auth");
const {validateCampground} = require('../middlewares/validation')
// Encode multipart/form-data forms
const multer = require("multer");

// cloudinary storage for campground images
const { storage } = require("../config/cloudinary");

// Multer + cloudinary
const parser = multer({ storage });

// Controllers
const campgrounds = require("../controllers/campgrounds");

// Campgrounds Routes
router
  .route("/")
  .get(campgrounds.index)
  .post(isLoggedIn, parser.array('image'),validateCampground, campgrounds.create);

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.get("/:id/edit", isLoggedIn, isCreator, campgrounds.renderUpdateForm);

// For cluster map
router.get("/all-camps", campgrounds.clusterMapSrc);

router
  .route("/:id")
  .get(campgrounds.show)
  .put(isLoggedIn, isCreator, parser.array('image'), validateCampground, campgrounds.update)
  .delete(isLoggedIn, isCreator, campgrounds.delete);

module.exports = router;
