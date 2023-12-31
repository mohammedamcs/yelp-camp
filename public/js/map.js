mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/satellite-v9", // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 14, // starting zoom
});

// create the popup
const popup = new mapboxgl.Popup({ offset: 30 }).setHTML(
  `<h5>${campground.location}</h5> <p>${campground.title}</p>`
);

// Create a default Marker and add it to the map.
const marker = new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(popup)
  .addTo(map);


  map.addControl(new mapboxgl.FullscreenControl());
  map.addControl(new mapboxgl.NavigationControl());

  