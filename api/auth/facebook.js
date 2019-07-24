const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const ApplicationSettings = require('../utils/ApplicationSettings');

passport.use(new FacebookStrategy({
    // clientID: ApplicationSettings.getValue("FACEBOOK_CLIENT_ID"),
    // clientSecret: ApplicationSettings.getValue("FACEBOOK_CLIENT_SECRET"),
    // callbackURL: ApplicationSettings.getValue("FACEBOOK_CALLBACK_URL")
    clientID:"1126912097518554",
    clientSecret:"0a547f86d78248ea61b49d36447eadce",
    callbackURL:"http://localhost:4000/auth/facebook/callback",
    enableProof: true,
    profileFields: ['id', 'displayName', 'photos','email', 'gender','first_name', 'last_name', 'middle_name']
},
    function (accessToken, refreshToken, profile, done) {
        console.log('accessToken :', accessToken);
        console.log('refreshToken :', refreshToken);
        console.log('profile :', JSON.stringify(profile._json.picture));
        console.log('profile :', profile);
        done(null, profile);
    }
));
// const dao = require('../dao/AccountDao');

// const JWTstrategy = require('passport-jwt').Strategy;
// const ExtractJWT = require('passport-jwt').ExtractJwt;

// const constant_helper = require('../utils/constant_helper')

