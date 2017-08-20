var express = require('express');
var Config = require('./util/const')('config');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var cors = require('cors');
var LocalStrategy = require('passport-local').Strategy;

var index = require('./routes/index');
var users = require('./routes/users');
var movies = require('./routes/movies');
var User = require('./database/user');

var app = express();
var http = require('http');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
    exposedHeaders: [
        'Authorization',
        'Content-Type'
    ]
}));

app.use('/', index);
app.use('/users', users);
app.use('/movies', movies);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//  MongoDB Setup

var db = mongoose.connection;

db.on('error', console.error);

db.once('open', function() {
    console.log("Connected to MongoDB.");
});

mongoose.connect(Config.mongoDB.connectionString, {
    useMongoClient: true
});

passport.use(new LocalStrategy({usernameField: 'email',passwordField: 'password'},function(email, password, cb) {

    User.findOne({ email: email },  function(err, u) {
        if (err)
            return cb(err);

        if (u == null)
            return cb(false);

        u.comparePassword(password, function(err, match) {
            if (err)
                throw err;

            if (match)
                return cb(null, u);

            return cb(false);
        });
    });
}));

module.exports = app;
