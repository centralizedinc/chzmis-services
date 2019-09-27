const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const AccountDao = require('../dao/AccountDao');
const UserDao = require('../dao/UserDao');

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const constant_helper = require('../utils/constant_helper');
const jwt = require('jsonwebtoken')
const ApplicationSettings = require('../utils/ApplicationSettings')

// VALIDATING TOKEN
passport.use(new JWTstrategy({
    secretOrKey: ApplicationSettings.getValue("JWT_SECRET_TOKEN"),
    jwtFromRequest: ExtractJWT.fromHeader('access_token')
}, async (token, done) => {
    try {
        console.log('Token verified');
        return done(null, token);
    } catch (error) {
        console.log(error);
        return done({
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
}, (email, password, done) => {
    var result = {
        is_authenticated: false
    }
    console.time("login");
    return AccountDao.findByEmail(email)
        .then((account_result) => {
            console.log('account_result :', account_result);
            if (!account_result) return done({ message: constant_helper.invalid_email_auth }, false);
            // Validate Password
            else {
                result.account = account_result;
                return account_result.isValidPassword(password);
            }
        })
        .then((isValid) => {
            console.log('isValid :', isValid);
            if (!isValid) return done({ message: constant_helper.invalid_password_auth }, false);
            else {
                const token = jwt.sign({
                    account_id: result.account.account_id,
                    notifications: result.account.notifications,
                    email: email,
                    date: new Date()
                }, ApplicationSettings.getValue("JWT_SECRET_TOKEN"));
                result.token = token;
                return AccountDao.modifyOne({ account_id: result.account.account_id }, { session_token: token });
            }
        })
        .then((modified_account) => {
            if (modified_account) return UserDao.findOne({ account_id: result.account.account_id });
        })
        .then((user) => {
            if (user) {
                result.user = user;
                result.account.password = undefined;
                result.is_authenticated = true;
            }
            console.timeEnd("login");
            return done(null, result);
        })
        .catch((error) => { return done(error) })
}))


// SIGNUP
passport.use('signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, done) => {
    AccountDao.create({ email, password })
        .then((account) => done(null, account))
        .catch((err) => done(err));
}))