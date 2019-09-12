"use strict";

const router = require("express").Router();
const passport = require('passport');

var UserDao = require('../dao/UserDao')
var AccountDao = require('../dao/AccountDao')
// var NotificationDao = require('../dao/NotificationsDao')

const ResponseHelper = require('../utils/response_helper');
const response_helper = new ResponseHelper('AUTH')

router.route('/login')
    .post(passport.authenticate('login', {
        session: false
    }), (req, res) => {
        response_helper.sendPostResponse(req, res, req.user, null, 1)
    })


router
    .route('/signup')
    .post((req, res) => {
        var data = req.body;
        console.log("signup data: " + JSON.stringify(data))
        if (data) {
            var result = {}
            AccountDao.create({
                email: data.email,
                method: data.method,
                password: data.password,
                // google_id: data.google_id,
                // facebook_id: data.facebook_id
            }).then((account) => {
                result.account = account
                const user = {
                    account_id: account.account_id,
                    avatar: data.avatar,
                    name: data.name,
                    address: data.address,
                    phone: data.phone,
                    email: data.email,
                    birthdate: data.birthdate
                }
                console.log('account :', account);
                return UserDao.create(user)
            }).then((user) => {
                result.user = user
                console.log('result :', result);
                response_helper.sendPostResponse(req, res, result, null, 0)
            }).catch((err) => {
                console.log("err data: " + JSON.stringify(err))
                response_helper.sendPostResponse(req, res, null, err, 0)
            });
        } else response_helper.sendPostResponse(req, res, null, err, 0)
    })


/***** SIGN UP USING GOOGLE ACCOUNT *****/
router.route('/auth/google')
    .get(passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

router.route('/auth/google/callback')
    .get(passport.authenticate('google', {
        session: false
    }), (req, res) => {
        res.redirect('http://localhost:8080/#/googleSignUp?data=' + new Buffer(JSON.stringify(req.user)).toString('base64'))
    });

/***** SIGN UP USING FACEBOOK ACCOUNT *****/
router.route('/auth/facebook')
    .get(passport.authenticate('facebook', { scope: ["email"] }));

router.route('/auth/facebook/callback')
    .get(passport.authenticate('facebook', {
        session: false
    }),
        (req, res) => {
            // Successful authentication, redirect home.
            console.log('/auth/facebook/callback')
            res.redirect('http://localhost:8080/#/facebookSignUp?data=' + new Buffer(JSON.stringify(req.user)).toString('base64'))
        });

module.exports = router;