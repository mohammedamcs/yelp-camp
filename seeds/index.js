const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// connection to mongodb
mongoose
  .connect(process.env.DB_URL || "mongodb://localhost:27017/campground")
  .then(() => console.log("connection to db is on..."))
  .catch((err) => console.log(err));



const images = [
  {
    url: "https://res.cloudinary.com/dvssdrwkg/image/upload/v1674031495/Campgrounds/holadgc1rgmmtysw6kku.jpg",
    filename: "Campgrounds/n5t9ekbh76cazuhqvtqq",
  },
  {
    url: "https://res.cloudinary.com/dvssdrwkg/image/upload/v1674031495/Campgrounds/cqyevccvbpyhqctwttej.jpg",
    filename: "Campgrounds/mcw9infbwj6mba1befqg",
  },
];

const sample = (array) => array[Math.floor(Math.random() * array.length)];

async function seedDB() {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const { city, country, center } = sample(cities);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${city}, SA`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images,
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam sunt nam ullam dolore nulla",
      price,
      creator: "63cfa968e9e5bb790410e374",
      geometry: {
        type: "Point",
        coordinates: center.reverse(),
      },
    });
    await camp.save();
  }
}

seedDB().then(() => mongoose.connection.close());
