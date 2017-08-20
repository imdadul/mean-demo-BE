/*
 *      user.js
 *      MongoDB Database Schema File for schema 'User'
 *
 *      Represents a registered user in the system.
 */

var SALT_WORK_FACTOR = 10;

var mongoose = require('mongoose')
var bcrypt = require('bcrypt');


var UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    lastLogin: { type: Date }
});

UserSchema.pre('save', function(next) {
    var user = this;

    user.lastLogin = Date.now();

    if (!user.isModified('password'))
        return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err)
            return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err)
                return next(err);
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err)
            return cb(err);

        cb(null, isMatch);
    });
};

UserSchema.methods.generateToken = function() {
    var JWTHelper = require('../util/jwt');
    var signed = JWTHelper.sign({
        email: this.email
    });

    this.lastLogin = Date.now();

    this.save(function(err, newU) {
        if (err)
            console.log('An error has occurred while setting the last login date for an user!');
    });
    
    return signed;
};


module.exports = mongoose.model('User', UserSchema);