const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
//const Joi = require("joi");
const { campgroundSchema, reviewSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");
const Campground = require("./models/campground");
const Review = require("./models/review");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  //useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connection established");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}

app.get("/", (req, res) => {
  res.render("campgrounds/home");
});

app.get(
  "/campgrounds",
  catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    if (!campgrounds) {
      next(new ExpressError("Campgrounds not found", 404));
    }
    res.render("campgrounds/index", { campgrounds });
  })
);

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res, next) => {
    //if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const { title, city, state, description, price, image } =
      req.body.campground;
    const location = `${city}, ${state}`;
    const campground = new Campground({
      title,
      location,
      description,
      price,
      image,
    });
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if (!campground) {
      next(new ExpressError("Campground not found", 404));
    }
    res.render("campgrounds/show", { campground });
  })
);

app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      next(new ExpressError("Campground not found", 404));
    }
    const array = campground.location.split(","); //since I used 2 fields for location (city and state) I had to trim
    const city = array[0];
    const state = array[1];
    res.render("campgrounds/edit", { campground, city, state });
  })
);

app.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { city, state } = req.body.campground;
    const location = `${city}, ${state}`;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
      location,
    });
    if (!campground) {
      next(new ExpressError("Campground not found", 404));
    }
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

app.post(
  "/campgrounds/:id/reviews",
  validateReview,
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.delete("/campgrounds/:id/reviews/:reviewId", catchAsync(async (req, res, next) => {
  //res.send('made it to the review deletion path')
  //const campground = await Campground.findById(req.params.id);
  //const review = await Review.findById(req.params.reviewId)
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
  await Review.findByIdAndDelete(reviewId)
  res.redirect(`/campgrounds/${id}`)
}))

//anything outside of what was mapped will fall into this
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = "Oh no! Something Went Wrong";
  res.status(status).render("error", { err });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
