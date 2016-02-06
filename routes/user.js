var router = require('express').Router();
var User = require('../models/user');
var passport = require('passport');
var passportConf = require('../config/passport');


//======================================================================================================================
// Login page
//======================================================================================================================

router.get('/login', function(req, res) {
    if(req.user) return res.redirect('/');
    res.render('account/login', { message: req.flash('loginMessag')})
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

//======================================================================================================================
// Profile page
//======================================================================================================================

    router.get('/profile', function(req, res, next){
        if(req.user)
          User.findOne({ _id: req.user._id}, function(err, user){
            if (err) return next(err);
                res.render('account/profile', {user: user});
          });
        else
            res.redirect('/');
    });

//======================================================================================================================
// Signup page
//======================================================================================================================

    router.get('/signup', function(req, res, next){
        res.render('account/signup', {
          errors: req.flash('errors')
        });
    });

    router.post('/signup', function(req, res, next){
        var user = new User();

        user.profile.name = req.body.name;
        user.profile.picture = user.gravatar();
        user.password = req.body.password;
        user.email = req.body.email;

        User.findOne({ email: req.body.email }, function(err, existingUser){
          if(existingUser) {
            console.log(req.body.email + " is already exist");
            req.flash('errors', 'Account with that email address already exist');
            return res.redirect('/signup');
          } else {
            user.save(function(err, user) {
              if(err) return next(err);

              req.logIn(user, function(err) {
                if (err) return next(err);
                res.redirect('/profile');

              });
            });
          }

        })
    });

//======================================================================================================================
// Logout
//======================================================================================================================

    router.get('/logout', function(req, res){
      req.logout();
      res.redirect('/');
    });

//======================================================================================================================
// User edit
//======================================================================================================================

    router.get('/edit-profile', function(req, res){
        if(req.user)
            res.render('account/edit-profile', {
              message: req.flash('success')
            });
        else
            res.redirect('/');
    });

    router.post('/edit-profile', function(req, res, next){
      User.findOne({ _id: req.user._id}, function(err, user) {
        if (err) return next(err);

        if (req.body.name) user.profile.name = req.body.name;
        if (req.body.address) user.address = req.body.address;

        user.save(function(err){
          if (err) return next(err);
          req.flash('success', 'Successfully Edited your profile');
          return res.redirect('/edit-profile');
        });
      });
    });

//======================================================================================================================
// Export
//======================================================================================================================

module.exports = router;
