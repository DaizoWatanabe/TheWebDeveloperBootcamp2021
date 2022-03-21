const express = require('express');
const router = express.Router();

const Campground = require('../models/campground');

const { campgroundSchema } = require('../schemas');
const { isLoggedIn } = require('../middleware');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get('/', catchAsync(async (req, res, next) => {
  const campgrounds = await Campground.find({});
  if (!campgrounds) {
    next(new ExpressError('Campgrounds not found', 404));
  }
  res.render('campgrounds/index', { campgrounds });
}),
);

router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
  //if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
  const { title, city, state, description, price, image } = req.body.campground;
  const location = `${city}, ${state}`;
  const campground = new Campground({ title, location, description, price, image });
  await campground.save();
  req.flash('success', 'Succesfully made a new campground');
  res.redirect(`/campgrounds/${campground._id}`);
}),
);

router.get('/:id', catchAsync(async (req, res, next) => {
  const campground = await Campground.findById(req.params.id).populate(
    'reviews',
  );
  if (!campground) {
    //next(new ExpressError('Campground not found', 404));
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground });
}),
);

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res, next) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    //next(new ExpressError('Campground not found', 404));
    if (!campground) {
      //next(new ExpressError('Campground not found', 404));
      req.flash('error', 'Cannot find that campground!');
      return res.redirect('/campgrounds');
    }
  }
  const array = campground.location.split(','); //since I used 2 fields for location (city and state) I had to trim
  const city = array[0];
  const state = array[1];
  res.render('campgrounds/edit', { campground, city, state });
}),
);

router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { city, state } = req.body.campground;
  const location = `${city}, ${state}`;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground, location });
  if (!campground) {
    next(new ExpressError('Campground not found', 404));
  }
  await campground.save();
  req.flash('success', 'Succesfully updated the campground!');
  res.redirect(`/campgrounds/${campground._id}`);
}),
);

router.delete('/:id', isLoggedIn, catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted campground!');
  res.redirect('/campgrounds');
}),
);

module.exports = router;
