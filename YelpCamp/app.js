if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth2").Strategy;

//mongo store session
const MongoStore = require('connect-mongo')(session);

//routers - require
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/user');

//initialize express application
const app = express();

//switch between development and production connections
//const dbUrl = process.env.DB_URL;
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

//mongodb connection config
mongoose.connect(dbUrl, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

//db connection handler
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Connection established');
});

//app initial config
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const secret = process.env.SECRET || 'yelpcampsecret';

const store = new MongoStore({
	url: dbUrl,
	secret,
	touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
	console.log("SESSION STORE ERROR", e);
});

//session config parameters
const sessionConfig = {
	store,
	name: 'ycsc',
	secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httponly: true,
		//secure: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
};

//session & flash
app.use(session(sessionConfig));
app.use(flash());

app.use(helmet());


const scriptSrcUrls = [
	"https://stackpath.bootstrapcdn.com/",
	"https://api.tiles.mapbox.com/",
	"https://api.mapbox.com/",
	"https://kit.fontawesome.com/",
	"https://cdnjs.cloudflare.com/",
	"https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
	"https://kit-free.fontawesome.com/",
	"https://stackpath.bootstrapcdn.com/",
	"https://api.mapbox.com/",
	"https://api.tiles.mapbox.com/",
	"https://fonts.googleapis.com/",
	"https://use.fontawesome.com/",
	"https://cdnjs.cloudflare.com/",
];
const connectSrcUrls = [
	"https://api.mapbox.com/",
	"https://*.tiles.mapbox.com/",
	"https://*.tiles.mapbox.com/",
	"https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: [],
			connectSrc: ["'self'", ...connectSrcUrls],
			scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
			styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
			workerSrc: ["'self'", "blob:"],
			objectSrc: [],
			imgSrc: [
				"'self'",
				"blob:",
				"data:",
				"https://res.cloudinary.com/dh4pnu0ox/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
				"https://images.unsplash.com/",
			],
			fontSrc: ["'self'", ...fontSrcUrls, "https://cdnjs.cloudflare.com/"],
			mediaSrc: ["https://res.cloudinary.com/dh4pnu0ox/"],
			childSrc: ["blob:"],
		},
	})
);



//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//passport-facebook
passport.use(new FacebookStrategy({
	clientID: process.env.FACEBOOK_APP_ID,
	clientSecret: process.env.FACEBOOK_APP_SECRET,
	callbackURL: "https://thawing-hamlet-89126.herokuapp.com/auth/facebook/callback"
},
	function (accessToken, refreshToken, profile, cb) {
		User.findOrCreate({ facebookId: profile.id }, function (err, user) {
			return cb(err, user);
		});
	}
));

//passport-google-oauth2
passport.use(new GoogleStrategy({
	clientID: process.env.GOOGLE_APP_ID,
	clientSecret: process.env.GOOGLE_APP_SECRET,
	callbackURL: "https://thawing-hamlet-89126.herokuapp.com/auth/google/callback",
	passReqToCallback: true
},
	function (request, accessToken, refreshToken, profile, done) {
		User.findOrCreate({ googleId: profile.id }, function (err, user) {
			return done(err, user);
		});
	}
));

//flash use
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

//routers use
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

//home router
app.get('/', (req, res) => {
	res.render('campgrounds/home');
});

//anything outside of what was mapped will fall into this
app.all('*', (req, res, next) => {
	next(new ExpressError('Page Not Found', 404));
});

//error handling
app.use((err, req, res, next) => {
	const { status = 500 } = err;
	if (!err.message) err.message = 'Oh no! Something Went Wrong';
	res.status(status).render('error', { err });
});

//port configuration
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Serving on port ${port}`);
});
