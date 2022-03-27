const express = require('express');
const router = express.Router({ mergeParams: true });
const Review = require('../models/review');
const Campground = require('../models/campground');
const { isLoggedIn, isReviewAuthor, validateReview } = require('../middleware');
const catchAsync = require('../utils/catchAsync');

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res, next) => {
  console.log(req.params);
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash('success', 'Created new review!');
  res.redirect(`/campgrounds/${campground._id}`);
})
);

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res, next) => {
  //res.send('made it to the review deletion path')
  //const campground = await Campground.findById(req.params.id);
  //const review = await Review.findById(req.params.reviewId)
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Successfully deleted review!');
  res.redirect(`/campgrounds/${id}`);
})
);

module.exports = router;
