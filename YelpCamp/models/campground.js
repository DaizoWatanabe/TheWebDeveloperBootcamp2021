const mongoose = require("mongoose");
const { Schema } = mongoose;

const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  location: String,
  image: String,
  description: String,
});

module.exports = mongoose.model("Campground", CampgroundSchema);
