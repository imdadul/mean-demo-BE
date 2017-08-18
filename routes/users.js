/**
 * Created by imdad on 13-Aug-17.
 */

/*
 *      routes/users.js
 *      Route file for the 'users' path
 *
 *      Holds all routes related to user management.
 */

var express = require('express');
var router = express.Router();

var passport = require('passport');
var validator = require('validator');
var JWTHelper = require('../util/jwt');
var User = require('../database/user');


router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err)
            return next(err);

        if (!user)
            return res.status(500).send({
                success: false,
                error: 'INVALID_LOGIN_DETAILS'
            });

        var tok = user.generateToken();

        return res.send({
            success: true,
            jwt: tok
        });
    })(req, res, next);
});

router.post('/signup', function(req, res, next) {
    if (!req.body.email || !req.body.password )
        return res.status(400).send({
            success: false,
            error: 'MISSING_REQUIRED_FIELDS'
        });

    if (!validator.isEmail(req.body.email))
        return res.status(400).send({
            success: false,
            error: 'INVALID_EMAIL_ADDRESS'
        });

    User.find({ email: req.body.email }, function(err, users) {
        if (err)
            return res.status(500).send({
                success: false,
                error: 'INTERNAL_SERVER_ERROR'
            });

        if (users.length)
            return res.status(400).send({
                success: false,
                error: 'EMAIL_ALREADY_EXISTS'
            });

        var u = new User({
            email:req.body.email,
            password:req.body.password
        })
        u.save(function (err,newUser) {
            if(err)
                return res.status(500).send({
                    success: false,
                    error: 'INTERNAL_SERVER_ERROR'
                });

            var tok = newUser.generateToken();

            return res.send({
                success: true,
                jwt: tok
            });


        })
    });
});


module.exports = router;
