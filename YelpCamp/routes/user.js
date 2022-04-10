const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/user');
const users = require('../controllers/users');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

//variables for forgot password routes and handlers
const async = require('async');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


//render register form & handling register
router.route('/register')
	.get(users.renderRegister)
	.post(catchAsync(users.register));

//render login form & handling login
router.route('/login')
	.get(users.renderLogin)
	.post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);


//logout route  
router.get('/logout', users.logout);

//facebook login route
router.get('/auth/facebook',
	passport.authenticate('facebook'));


//facebook login callback
router.get('/auth/facebook/callback',
	passport.authenticate('facebook', { failureRedirect: '/login' }),
	function (req, res) {
		// Successful authentication, redirect home.
		res.redirect('/');
	});

//google login route
router.get('/auth/google',
	passport.authenticate('google', {
		scope:
			['email', 'profile']
	}
	));

//google login callback
router.get('/auth/google/callback',
	passport.authenticate('google', { failureRedirect: '/login' }), users.login);

//render forgot password
router.get('/forgot', function (req, res) {
	res.render('users/forgot');
});

//forgot password handler
router.post('/forgot', function (req, res, next) {
	async.waterfall([
		function (done) {
			crypto.randomBytes(20, function (err, buf) {
				const token = buf.toString('hex');
				done(err, token);
			});
		},
		function (token, done) {
			User.findOne({ email: req.body.email }, function (err, user) {
				if (!user) {
					req.flash('error', 'No account with that email address exists.');
					return res.redirect('/forgot');
				}

				user.resetPasswordToken = token;
				user.resetPasswordExpires = Date.now() + 60 * 60; // 1 hour

				user.save(function (err) {
					done(err, token, user);
				});
			});
		},
		function (token, user, done) {
			const smtpTransport = nodemailer.createTransport({
				service: 'Gmail',
				auth: {
					user: 'yelpcampdgsw@gmail.com',
					pass: process.env.GMAILPW
				}
			});
			const mailOpts = {
				to: user.email,
				from: 'yelpcampdgsw@gmail.com',
				subject: 'YelpCamp | Password Reset',
				text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
					'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
					'http://' + req.headers.host + '/reset/' + token + '\n\n' +
					'If you did not request this, please ignore this email.\n'
			};
			smtpTransport.sendMail(mailOpts, function (err) {
				console.log('mail sent');
				req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
				done(err, 'done');
			});
		}
	], function (err) {
		if (err) return next(err);
		res.redirect('/forgot');
	});
});

router.get('/reset/:token', function (req, res) {
	User.findOne({ resetPasswordToken: req.params.token }, function (err, user) {
		console.log(user);
		if (!user) {
			req.flash('error', 'Password reset token is invalid or has expired.');
			return res.redirect('/forgot');
		}
		res.render('users/reset', { token: req.params.token });
	});
});

router.post('/reset/:token', function (req, res) {
	async.waterfall([
		function (done) {
			User.findOne({ resetPasswordToken: req.params.token }, function (err, user) {
				if (!user) {
					req.flash('error', 'Password reset token is invalid or has expired.');
					return res.redirect('back');
				}
				if (req.body.password === req.body.confirm) {
					user.setPassword(req.body.password, function (err) {
						user.resetPasswordToken = undefined;
						user.resetPasswordExpires = undefined;

						user.save(function (err) {
							req.logIn(user, function (err) {
								done(err, user);
							});
						});
					});
				} else {
					req.flash('error', 'Passwords do not match.');
					return res.redirect('back');
				}
			});
		},
		function (user, done) {
			const smtpTransport = nodemailer.createTransport({
				service: 'Gmail',
				auth: {
					user: 'yelpcampdgsw@gmail.com',
					pass: process.env.GMAILPW
				}
			});
			const mailOpts = {
				to: user.email,
				from: 'yelpcampdgsw@gmail.com',
				subject: 'YelpCamp | Password Changed!',
				text: 'Hello,\n\n' +
					'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
			};
			smtpTransport.sendMail(mailOpts, function (err) {
				req.flash('success', 'Success! Your password has been changed.');
				done(err);
			});
		}
	], function (err) {
		res.redirect('/');
	});
});

module.exports = router;

