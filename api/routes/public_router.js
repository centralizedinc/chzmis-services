"use strict";

const router = require("express").Router();
const passport = require('passport');
const jwt = require('jsonwebtoken')

var UserDao = require('../dao/UserDao')

const ResponseHelper = require('../utils/response_helper');
const response_helper = new ResponseHelper('AUTH')

const ApplicationSettings = require('../utils/ApplicationSettings')

router
    .route('/signup')
    .post(passport.authenticate('signup', { session: false }), (req, res) => {
        var data = req.body;
        data.account_id = req.user._id;
        UserDao.create(data)
            .then((result) => {
                response_helper.sendPostResponse(req, res, result, null, 0)
            }).catch((err) => {
                response_helper.sendPostResponse(req, res, null, err, 0)
            });
    })

router.route('/login')
    .post(passport.authenticate('login', { session: false }), (req, res) => {
        UserDao.findOne({ account_id: req.user._id })
            .then((user) => {
                const token = jwt.sign({ id: req.user._id, email: req.user.email }, ApplicationSettings.getValue("JWT_SECRET_TOKEN"));
                console.log('object');
                response_helper.sendPostResponse(req, res, { account: req.user, user, token }, null, 1)
            }).catch((err) => {
                response_helper.sendPostResponse(req, res, null, err, 1)
            });
    })

// router
//     .route('/login')
//     .post((req, res) => {
//         console.log('req.body :', req.body);
//         passport.authenticate('local',  (err, user, info) => {
//             console.log('after auth');
//             try {
//                 if (err || !user) {
//                     const error = new Error('An Error occured')
//                     response_helper.sendPostResponse(req, res, null, error, 0)
//                 } else {
//                     req.login(user, { session: false }, (error) => {
//                         if (error) {
//                             response_helper.sendPostResponse(req, res, null, error, 0)
//                         } {
//                             const token = jwt.sign({ id: user._id, email: user.email }, ApplicationSettings.getValue("JWT_SECRET_TOKEN"));
//                             response_helper.sendPostResponse(req, res, { user, token }, error, 0)
//                         }
//                     });
//                 }
//             } catch (error) {
//                 response_helper.sendPostResponse(req, res, null, error, 0)
//             }
//         })(req, res, next);
//     })

module.exports = router;