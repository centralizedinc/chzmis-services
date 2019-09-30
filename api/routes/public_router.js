"use strict";

const router = require("express").Router();
const passport = require('passport');

var UserDao = require('../dao/UserDao')
var AccountDao = require('../dao/AccountDao')
var NotificationDao = require('../dao/NotificationsDao')

var ApplicationSettings = require("../utils/ApplicationSettings");
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
        if (data != null) {
            var result = {}
            console.log("singup have data:")
            AccountDao.create({
                email: data.account.email,
                method: data.account.method,
                password: data.account.password,
                // google_id: data.google_id,
                // facebook_id: data.facebook_id
            }).then((account) => {
                console.log("account: "+ JSON.stringify(account))
                result.account = account
                const user = {
                    account_id: account.account_id,
                    // avatar: data.avatar,
                    name: data.name,
                    // address: data.address,
                    // phone: data.phone,
                    email: data.email,
                    // birthdate: data.birthdate
                }
                console.log('account :', account);
                return UserDao.create(user)
            }).then((user) => {
                result.user = user
                console.log('result :', result);
                var mode = {
                    email: result.account.email,
                    substitutions: {
                        registration_url: `http://localhost:8080/#/confirmRegistration`
                        // ?code=${new Buffer(JSON.stringify({account_id: result.account.account_id})).toString('base64')}
                    }
                }
                var template_id = ApplicationSettings.getValue("REGISTRATION_EMAIL_TEMPLATE")
                result.mode = mode
                return NotificationDao.emailNotifications(mode, template_id)
            }).then((notify) => {
                console.log("notification data: " + notify)
                console.log("result data: " + result)
                response_helper.sendPostResponse(req, res, result, null, 0)
            })
            
            .catch((err) => {
                console.log("err data: " + JSON.stringify(err))
                response_helper.sendPostResponse(req, res, null, err, 0)
            });
        } else{
             response_helper.sendPostResponse(req, res, null, err, 0)
        }
            })

            /******** FORGET PASSWORD ********/
            router.route('/forgetPassword')
            .get((req,res)=>{
                var result = req.body
                console.log("forget password req body: " + JSON.stringify(result))
                var mode = {
                    email: result.email,
                    substitutions: { 
                        // registration_url: `http://localhost:8080/#/confirmRegistration`
                        // ?code=${new Buffer(JSON.stringify({account_id: result.account.account_id})).toString('base64')}
                    }
                }
                var template_id = ApplicationSettings.getValue("FORGET_PASSWORD_TEMPLATE")
                
                NotificationDao.emailNotifications(mode, template_id).then((result)=>{
                    console.log("notification forget password: " + JSON.stringify(result))
                })
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