"use strict";

const router = require("express").Router();
const passport = require('passport');
const jwt = require('jsonwebtoken')

var UserDao = require('../dao/UserDao')

const ResponseHelper = require('../utils/response_helper');
const response_helper = new ResponseHelper('AUTH')

const ApplicationSettings = require('../utils/ApplicationSettings')


router.route('/login')
    .post(passport.authenticate('login', {
        session: false
    }), (req, res) => {
        UserDao.findOne({
                account_id: req.user._id
            })
            .then((user) => {
                const token = jwt.sign({
                    id: req.user._id,
                    email: req.user.email
                }, ApplicationSettings.getValue("JWT_SECRET_TOKEN"));
                console.log('object');
                response_helper.sendPostResponse(req, res, {
                    account: req.user,
                    user,
                    token
                }, null, 1)
            }).catch((err) => {
                response_helper.sendPostResponse(req, res, null, err, 1)
            });
    })


/***** SIGN UP USING EMAIL ONLY *****/
router
    .route('/signup')
    .post(
        // passport.authenticate('signup', { session: false }),
        (req, res) => {
            var data = req.body;
            console.log("signup data: " + JSON.stringify(data))
            // data.account_id = req.user._id;
            UserDao.create(data)
                .then((result) => {
                    console.log("result data: " + JSON.stringify(result))

                    response_helper.sendPostResponse(req, res, result, null, 0)
                }).catch((err) => {
                    console.log("err data: " + JSON.stringify(err))
                    response_helper.sendPostResponse(req, res, null, err, 0)
                });
        })


/***** SIGN UP USING GOOGLE ACCOUNT *****/
router.route('/auth/google')
    .get(passport.authenticate('google', {
        scope: ['https://www.googleapis.com/auth/plus.login']
    }));

router.route('/auth/google/callback')
    .get(passport.authenticate('google', {
        session: false
    }), (req, res) => {
        res.redirect('http://localhost:8080/#/googleSignUp?data=' + new Buffer(JSON.stringify(req.user)).toString('base64'))
    });

/***** SIGN UP USING FACEBOOK ACCOUNT *****/
router.route('/auth/facebook')
    .get(passport.authenticate('facebook'), (req, res) => {
        console.log('/auth/facebook')
    });
//   .get((req, res)=>{
//       res.json("HELLO")
//   })

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