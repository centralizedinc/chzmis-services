const passport = require('passport');

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

const ApplicationSettings = require('../utils/ApplicationSettings');

const AccountDao = require('../dao/AccountDao');

passport.use('google', new GoogleStrategy({
    clientID: ApplicationSettings.getValue("GOOGLE_CLIENT_ID"),
    clientSecret: ApplicationSettings.getValue("GOOGLE_CLIENT_SECRET"),
    callbackURL: ApplicationSettings.getValue("GOOGLE_CALLBACK_URL")
},
    function (google_access_token, refreshToken, profile, done) {
        console.log('accessToken :', google_access_token);
        console.log('refreshToken :', refreshToken);
        console.log('profile :', profile);
        AccountDao.processGoogle({ profile, google_access_token })
        .then((result) => {
            console.log('Account :', result.account_id);
            done(null, { profile, google_access_token });
        }).catch((err) => {
            console.log('err :', err);
            done(null, { profile, google_access_token });
        });
        
    }
));