const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const router = express.Router();
const passport = require('passport');

const User = require('../models/user');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post('/register', catchAsync(async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
      if (err) return next(err);
      req.flash('success', 'Welcome to Yelp Camp!');
      res.redirect('/campgrounds');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('register');
  }
  //await registeredUser.save();
}));

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
  req.flash('success', 'Welcome Back!');
  const redirectUrl = req.session.returnTo || '/campgrounds';
  res.redirect(redirectUrl);
});

router.get('/logout', (req, res) => {
  req.logOut();
  req.flash('success', 'Goodbye!');
  res.redirect('/campgrounds');
});

module.exports = router;

