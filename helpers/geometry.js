const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

// Model
const Campground = require("../models/campground");

module.exports.storeGeometry = async (campground, location) => {
  // latitude and longitude coordinates from geocode provided by map box base on location provided by user.
  const geoData = await geocoder
    .forwardGeocode({
      query: location,
      limit: 1,
    })
    .send();

  // If the location is wrong and has no latitude and longitude
  if (!geoData.body.features.length) {
    // On fail to find latitude and longitude store default instead
    campground.geometry = {
      type: "Point",
      coordinates: [-116.867808, 37.401573],
    };
  } else {
    // Add geoJSON from mapbox to campground's geometry field based on location provided by user.
    campground.geometry = geoData.body.features[0].geometry;
  }
};

module.exports.updateGeometry = async (id, location) => {

  const campground = await Campground.findById(id);
  
  // if location is updated by user
  if (campground.location !== location) {

    // latitude and longitude coordinates from geocode provided by map box base on location provided by user.
    const geoData = await geocoder
      .forwardGeocode({
        query: location,
        limit: 1,
      })
      .send();

    // If the location is wrong and has no latitude and longitude
    if (!geoData.body.features.length) {
      // On fail to find latitude and longitude store default instead
      campground.geometry = {
        type: "Point",
        coordinates: [-116.867808, 37.401573],
      };
    } else {
      // Add geoJSON from mapbox to campground's geometry field based on location provided by user.
      campground.geometry = geoData.body.features[0].geometry;
    }
    // Save updated location for campground
    await campground.save();
  }
};
