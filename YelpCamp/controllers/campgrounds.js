const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res, next) => {
  const campgrounds = await Campground.find({});
  if (!campgrounds) {
    next(new ExpressError('Campgrounds not found', 404));
  }
  res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {
  //if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
  const { title, city, state, description, price } = req.body.campground;
  const location = `${city}, ${state}`;
  const geoData = await geoCoder.forwardGeocode({
    query: location,
    limit: 1
  }).send();
  const campground = new Campground({ title, location, description, price });
  campground.geometry = geoData.body.features[0].geometry;
  campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
  campground.author = req.user._id;
  console.log(campground);
  await campground.save();
  req.flash('success', 'Succesfully made a new campground');
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res, next) => {
  const campground = await Campground.findById(req.params.id).populate({
    path: 'reviews',
    populate: {
      path: 'author'
    }
  }).populate('author');
  if (!campground) {
    //next(new ExpressError('Campground not found', 404));
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground });
};

module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    //next(new ExpressError('Campground not found', 404));
    if (!campground) {
      //next(new ExpressError('Campground not found', 404));
      req.flash('error', 'Cannot find that campground!');
      return res.redirect('/campgrounds');
    }
  }
  const array = campground.location.split(','); //since I used 2 fields for location (city and state) I had to split
  const city = array[0];
  const state = array[1];
  res.render('campgrounds/edit', { campground, city, state });
};

module.exports.updateCampground = async (req, res, next) => {
  const { id } = req.params;
  const { city, state } = req.body.campground;
  const location = `${city}, ${state}`;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground, location });
  if (!campground) {
    next(new ExpressError('Campground not found', 404));
  }
  const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
  campground.images.push(...imgs);
  //geolocalização
  const geoData = await geoCoder.forwardGeocode({
    query: location,
    limit: 1
  }).send();
  campground.geometry = geoData.body.features[0].geometry;
  await campground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
  }
  req.flash('success', 'Succesfully updated the campground!');
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res, next) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted campground!');
  res.redirect('/campgrounds');
};