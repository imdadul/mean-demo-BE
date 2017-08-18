/*
 *      movie.js
 *      MongoDB Database Schema File for schema 'Movie'
 *
 *      Represents a registered Movie in the system.
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

MovieSchema.virtual('avgRating').get(function () {
    if(this.ratings.length==0) return 0;
    var count = 0;
    this.ratings.forEach(function (r) {
        count+=r.rating;
    })
    return count/this.ratings.length;
});

MovieSchema.methods.getYourRating = function(req) {
    for(var i = 0;i<this.ratings.length ; i++){
        if(this.ratings[i].user.email==req.user.email){
            return this.ratings[i].rating;
        }
    }
};

// MovieSchema.methods.sendPushNotification = function (user,action) {
//     push_notification.movieDataUpdated(user,action,this);
// }

module.exports = mongoose.model('Movie', MovieSchema);