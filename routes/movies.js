/**
 * Created by imdad on 15-Aug-17.
 */
/*
 *      routes/movies.js
 *      Route file for the 'movies' path
 *
 *      Holds all routes related to user management.
 */

var express = require('express');
var router = express.Router();

var JWTHelper = require('../util/jwt');
var push_notification = require('../push-notification/push-notification');
var EVENTS = require('../util/EVENTS');
var Movie = require('../database/movie');


router.get('/', JWTHelper.middlewareValidateUser, function(req, res, next) {
    Movie.find({}).populate('ratings.user','email _id').exec(function(err, movies) {
        if (err)
            sendServerError(res)
        return res.send({
            success: true,
            movies: movies// Depending on the requirement specific props should be forwarded.
        });
    });
});

router.post('/', JWTHelper.middlewareValidateUser, function(req, res, next) {
    Movie.findOne({title:req.body.title},function(err, movie) {
        if (err)
            sendServerError(res)
        if(movie)
            return res.status(400).send({
                success: false,
                error: 'MOVIE_ALREADY_EXISTS'
            });

        var m = new Movie({
            title:req.body.title,
            releaseDate:req.body.releaseDate,
            duration:req.body.duration,
            director:req.body.director,
            actors:req.body.actors
        });

        m.save(function(err,newMovie){
            if(err){
                sendServerError(res)
            }
            push_notification.notifyAllUsers(req.user,EVENTS.PUSH_MOVIE_ADDED,newMovie);
            return res.send({
                success: true,
                movie: newMovie,
                msg:EVENTS.MOVIE_ADD_SUCCESS
            });

        })
    });
});

router.put('/:id', JWTHelper.middlewareValidateUser, function(req, res, next) {
    Movie.findOne({_id:req.params.id},function(err, movie) {
        if (err)
            sendServerError(res)
        if(!movie)
            return res.status(400).send({
                success: false,
                error: 'MOVIE_NOT_FOUND'
            });

        movie.title= req.body.title;
        movie.releaseDate= req.body.releaseDate;
        movie.duration= req.body.duration;
        movie.director= req.body.director;
        movie.actors= req.body.actors;

        movie.save(function(err,newMovie){
            if(err){
                sendServerError(res)
            }
            Movie.populate(newMovie, { path: 'ratings.user', select: 'email _id '}, function (err, newPopulatedMovie) {
                if(err){
                    sendServerError(res)
                }
                push_notification.notifyAllUsers(req.user,EVENTS.PUSH_MOVIE_EDITED,newPopulatedMovie);
                return res.send({
                    success: true,
                    msg:EVENTS.MOVIE_EDIT_SUCCESS,
                    movie:newPopulatedMovie
                });
            });

        })
    });
});

router.delete('/:_id', JWTHelper.middlewareValidateUser, function(req, res, next) {
    var toDeleteMovieId=req.params._id;
    Movie.remove({_id:toDeleteMovieId},function(err) {
        if(err){
            sendServerError(res)
        }

        push_notification.notifyAllUsers(req.user,EVENTS.PUSH_MOVIE_DELETED,{_id:toDeleteMovieId});
        return res.send({
            success: true,
            msg:EVENTS.MOVIE_DELETE_SUCCESS
        });
    });
});

router.put('/rating/:id',JWTHelper.middlewareValidateUser, function(req, res, next) {
    Movie.findOne({_id:req.params.id},function(err, movie) {
        if (err)
            sendServerError(res)
        if(!movie)
            return res.status(400).send({
                success: false,
                error: EVENTS.MOVIE_NOT_FOUND
            });

        movie.ratings.push({
            user:req.user._id,
            rating: req.body.rating,
            comment:req.body.comment
        })

        movie.save(function(err,newMovie){
            if(err){
                sendServerError(res)
            }

            Movie.populate(newMovie, { path: 'ratings.user', select: 'email _id '}, function (err, newPopulatedMovie) {
                if(err){
                    sendServerError(res)
                }
                push_notification.notifyAllUsers(req.user,EVENTS.PUSH_MOVIE_RATED,newPopulatedMovie);
                return res.send({
                    success: true,
                    msg:EVENTS.MOVIE_RATE_SUCCESSFULL,
                    movie:newPopulatedMovie
                });
            });

        })

    });
});

function sendServerError (res) {
    return res.status(500).send({
        success: false,
        error: EVENTS.INTERNAL_SERVER_ERROR
    });
}


module.exports = router;
