/**
 *      movie.js
 *       MongoDB Database Schema File for schema 'Movie'
 *
 *       Represents a registered Movie in the system.
 */

var mongoose = require('mongoose')
    , Schema = mongoose.Schema;
var MovieSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true, trim: true },
    releaseDate: { type: Date, required: true },
    duration: { type: Number, required: true },
    director: { type: String, required: true },
    actors: { type: [String], required: true },
    ratings: { type: [{
        user : { type: Schema.Types.ObjectId, ref: 'User' },
        rating:{type:Number},
        comment:{type:String}
    }] }
}, {
    toJSON: {
        virtuals: true
    }
});

/**
 * @description Calculates a new property (avgRating) which is not in the database, sends to the response.
 */

MovieSchema.virtual('avgRating').get(function () {
    if(this.ratings.length==0) return 0;
    var count = 0;
    this.ratings.forEach(function (r) {
        count+=r.rating;
    })
    return count/this.ratings.length;
});


module.exports = mongoose.model('Movie', MovieSchema);