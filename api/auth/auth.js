const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const dao = require('../dao/AccountDao');

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const constant_helper = require('../utils/constant_helper');
const ApplicationSettings = require('../utils/ApplicationSettings');

// VALIDATING TOKEN
passport.use(new JWTstrategy({
    secretOrKey: ApplicationSettings.getValue("JWT_SECRET_TOKEN"),
    jwtFromRequest: ExtractJWT.fromUrlQueryParameter('access_token')
}, async (token, done) => {
    try {
        return done(null, token);
    } catch (error) {
        console.log(error);
        done({
            success: false,
            code: "UNAUTHORIZED",
            message: "Invalid Token",
            error
        });
    }
}));


// LOGIN
passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    console.log('email :', email);
    dao.findByEmail(email)
        .then((account) => {
            console.log('account :', account);
            if (!account) return done(null, false, { message: constant_helper.invalid_email_auth })
            console.log('password :', password);
            // Validate Password
            const validate = account.isValidPassword(password);
            console.log('validate :', validate);
            if (!validate) done(null, false, { message: constant_helper.invalid_password_auth });
            else {
                account.password = undefined
                done(null, account, { message: constant_helper.successful_auth });
            }
        }).catch((error) => done(error));
}))


// SIGNUP
passport.use('signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, done) => {
    dao.create({ email, password })
        .then((account) => done(null, account))
        .catch((err) => done(err));
}))