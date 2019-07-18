const passport = require('passport');
const LocalStrategy = require('passport-local');
const dao = require('../dao/AccountDao');

passport.use('signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, done) => {
    dao.create({ email, password })
        .then((account) => done(null, account))
        .catch((err) => done(err));
}))

passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    dao.findOne({ email })
        .then((account) => {
            if (!account) return done(null, false, { message: 'Invalid Email' })

            // Validate Password
            const validate = account.isValidPassword(password);
            if (!validate) done(null, false, { message: 'Invalid Password' });
            else done(null, account, { message: 'Logged in Successfully' });
        }).catch((error) => done(error));
}))