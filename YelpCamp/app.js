const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
//const Joi = require("joi");

//routers - require
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/user");

//initialize express application
const app = express();

//mongodb connection config
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  //useCreateIndex: true,
  useUnifiedTopology: true,
});

//db connection handler
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connection established");
});

//app initial config
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

//session config parameters
const sessionConfig = {
  secret: "yelpcampsecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httponly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

//session & flash
app.use(session(sessionConfig));
app.use(flash());

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash use
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//routers use
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

//home router
app.get("/", (req, res) => {
  res.render("campgrounds/home");
});

//anything outside of what was mapped will fall into this
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

//error handling
app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = "Oh no! Something Went Wrong";
  res.status(status).render("error", { err });
});

//port 3000 open
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
