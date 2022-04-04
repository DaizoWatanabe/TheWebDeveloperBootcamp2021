const mongoose = require('mongoose');
const Review = require('./review');
const { Schema } = mongoose;

const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  location: String,
  images: [
    {
      url: String,
      filename: String
    }
  ],
  description: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId, ref: 'Review'
    }
  ],
});

CampgroundSchema.post('findOneAndDelete', async function (campground) {
  if (campground) {
    await Review.deleteMany({
      _id: {
        $in: campground.reviews
      }
    });
  }
});

module.exports = mongoose.model('Campground', CampgroundSchema);
