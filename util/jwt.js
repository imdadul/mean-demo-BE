var _ = require('lodash');
var jwt = require('jsonwebtoken');

var User = require('../database/user');

var keys = require('../util/const')('keys');

function JWTHelper() {

}

JWTHelper.prototype.sign = function(payload) {
    payload.exp = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 1);

    var token = jwt.sign(payload, keys.jwt);

    return token;
};

JWTHelper.prototype.middlewareValidateUser = function(req, res, next) {
    if (!req.header('Authorization')) {
        return res.status(401).send({
            success: false,
            error: 'AUTHORIZATION_TOKEN_REQUIRED'
        });
    }

    console.log('Got HTTP Authorization: ' + req.header('Authorization'));

    var bearer = _.split(req.header('Authorization'), ' ')[1];

    try {
        var decoded = jwt.decode(bearer, keys.jwt);

        if (decoded == null)
            return res.status(401).send({
                success: false,
                error: 'INVALID_BEARER_TOKEN'
            });

        User.findOne({ email: decoded.email }, function(err, dec) {
            if (dec == null) {
                return res.status(401).send({
                    success: false,
                    error: 'INVALID_BEARER_TOKEN'
                });
            }

            req.user = dec;

            return next();
        });
    } catch (err) {
        return null;
    }
};

module.exports = (new JWTHelper());