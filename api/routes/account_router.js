"use strict";

var router = require("express").Router();

// DAO
var GroupDao = require('../dao/GroupDao');
var ChannelDao = require('../dao/ChannelsDao');
var ConnectionDao = require('../dao/ConnectionsDao');
var AccountDao = require('../dao/AccountDao');
var NotificationDao = require('../dao/NotificationsDao')

// Utils
var ResponseHelper = require("../utils/response_helper");
var ApplicationSettings = require("../utils/ApplicationSettings");
var response_helper = new ResponseHelper('ACC')
//Jwt
var jwt = require('jsonwebtoken')

router.route("/verify/email")
.get((req, res) => {
    var email = req.body.email
    console.log("entering email: " + email)
    AccountDao.findByEmail(email).then((result)=>{
        console.log("find by email result: " + JSON.stringify(result))
        response_helper.sendGetResponse(req, res, result, null, 1)
    })
})
/******* CONFIRM ACCOUNT *******/
router.route("/confirmation")
.get((req, res) =>{
    AccountDao.findAll().then((result)=>{
        console.log("find all account: " + result)
        response_helper.sendGetResponse(req, res, result, null, 0)
    })
})
    .post((req, res) => {
        var account_id = req.body.id
        // if (req.headers && req.headers.access_token) {
        //     var token = req.headers.access_token;
        //     user_session = jwt.decode(token);
        // }

        AccountDao.findOneProfile(account_id)
            .then((result) => {
                console.log("AccountDao find profile: " + JSON.stringify(result))
                response_helper.sendPostResponse(req, res, result, null, 0)
            }).catch((err) => {
                console.log("AccountDao fin profile error: " + JSON.stringify(err))
                response_helper.sendPostResponse(req, res, null, err, 0)
            })
    })


router.route("/password")
    .post((req, res) => {
        console.log("password req.body: " + JSON.stringify(req.body))
        var id = req.body.id
        var password = req.body.password
        // if (req.headers && req.headers.access_token) {
        //     var token = req.headers.access_token;
        //     user_session = jwt.decode(token);
        // }
            
        AccountDao.checkPassword(id, password)
    .then((result)=>{
        console.log("check passsword: " + JSON.stringify(result))
        response_helper.sendPostResponse(req, res, result, null, 0)
    }).catch((err) => {
        response_helper.sendPostResponse(req, res, null, err, 0)
    })
        // AccountDao.updatePasswordEmail(email, new_password)
        //     .then((result) => {
        //         console.log("AccountDao password: " + JSON.stringify(result))
        //         response_helper.sendPostResponse(req, res, result, null, 0)
        //     }).catch((err) => {
        //         console.log("AccountDao password: " + JSON.stringify(err))
        //         response_helper.sendPostResponse(req, res, null, err, 0)
        //     })
    })

router.route("/forgetpassword")
    .post((req, res) => {
        console.log("forget password req.body: " + JSON.stringify(req.body))
        var email = req.body.email
        // if (req.headers && req.headers.access_token) {
        //     var token = req.headers.access_token;
        //     user_session = jwt.decode(token);
        // }

        AccountDao.findOne({email: email})
            .then((result) => {
                console.log("find one email by : " + JSON.stringify(result))
                var mode = {
                    email: email,
                    substitutions: { 
                        registration_url: `http://localhost:8080/#/new_password/?account_id=${new Buffer(JSON.stringify({account_id: result.account_id})).toString('base64')}`
                        // ?code=${new Buffer(JSON.stringify({account_id: result.account.account_id})).toString('base64')}
                    }
                }
                var template_id = ApplicationSettings.getValue("FORGET_PASSWORD_TEMPLATE")
                
               return NotificationDao.emailNotifications(mode, template_id)
            })
            .then((notify)=>{
                console.log("notification forget password: " + JSON.stringify(notify))
                response_helper.sendPostResponse(req, res, notify, null, 0)
            })
            .catch((err) => {
                console.log("AccountDao forgetpassword: " + JSON.stringify(err))
                response_helper.sendPostResponse(req, res, null, err, 0)
            })
    })

    router.route('/new_password/:account_id')
    .post((req,res) => {
        var password = req.body
        AccountDao.checkPassword(req.params.account_id, password).then((result) => {
            response_helper.sendGetResponse(req, res, result, null, 0)
        }).catch((err) => {
            response_helper.sendGetResponse(req, res, null, err, 0)
        })
    })

router.route('/delete')
    // Delete Group
    .post((req, res) => {
        var user_session = null;
        if (req.headers && req.headers.access_token) {
            var token = req.headers.access_token;
            user_session = jwt.decode(token);
        }
        if (user_session && user_session.id) {
            GroupDao.findOneByIdAndUpdate(req.body.group_id, {
                    modified_by: user_session.id,
                    status: 0
                })
                .then((result) => {
                    response_helper.sendPostResponse(req, res, result, null, 0)
                }).catch((err) => {
                    response_helper.sendPostResponse(req, res, null, err, 0)
                });
        } else {
            response_helper.sendPostResponse(
                req,
                res,
                null, {
                    local_errors: [{
                        message: "Invalid Token."
                    }]
                },
                0
            );
        }
    });

router
    .route('/:id')
    // Get Group By ID
    .get((req, res) => {
        GroupDao.findOneByID(req.params.id)
            .then((result) => {
                response_helper.sendGetResponse(req, res, result, null, 1)
            }).catch((err) => {
                response_helper.sendGetResponse(req, res, null, err, 1)
            });
    })
    // Update Group By ID
    .post((req, res) => {
        var user_session = null;
        if (req.headers && req.headers.access_token) {
            var token = req.headers.access_token;
            user_session = jwt.decode(token);
        }
        if (user_session && user_session.id) {
            var group = req.body;
            group.modified_by = user_session.id
            GroupDao.modifyByID(req.params.id, group)
                .then((result) => {
                    response_helper.sendPostResponse(req, res, result, null, 1)
                }).catch((err) => {
                    response_helper.sendPostResponse(req, res, null, err, 1)
                });
        } else {
            response_helper.sendPostResponse(
                req,
                res,
                null, {
                    local_errors: [{
                        message: "Invalid Token."
                    }]
                },
                1
            );
        }

    });




/******* FAVORITES *******/

router
    .route('/favorites/add')
    // Set Favorites
    .post((req, res) => {
        const { type, parent_id } = req.body,
            account_id = jwt.decode(req.headers.access_token).account_id;
        AccountDao.addToFavorites(account_id, type, parent_id)
            .then((result) => {
                console.log('result :', result);
                response_helper.sendGetResponse(req, res, result, null, 2)
            })
            .catch((err) => {
                response_helper.sendGetResponse(req, res, null, err, 2)
            });
    })

router
    .route('/favorites/remove')
    // Remove Favorites
    .post((req, res) => {
        const { parent_id } = req.body,
            account_id = jwt.decode(req.headers.access_token).account_id;
        AccountDao.removeFromFavorites(account_id, parent_id)
            .then((result) => {
                response_helper.sendGetResponse(req, res, result, null, 2)
            })
            .catch((err) => {
                response_helper.sendGetResponse(req, res, null, err, 2)
            });
    })


/****** MEMBERS ******/

// router
//     .route('/members/new')
//     // Add New Member of a Group
//     .post((req, res) => {
//         var user_session = null;
//         if (req.headers && req.headers.access_token) {
//             var token = req.headers.access_token;
//             user_session = jwt.decode(token);
//         }
//         if (user_session && user_session.id) {
//             GroupDao.findOneByIdAndUpdate(req.body.group_id, {
//                     modified_by: user_session.id,
//                     members: {
//                         $push: req.body.user_id
//                     }
//                 })
//                 .then((result) => {
//                     response_helper.sendGetResponse(req, res, result, null, 2)
//                 })
//                 .catch((err) => {
//                     response_helper.sendGetResponse(req, res, null, err, 2)
//                 });
//         } else {
//             response_helper.sendPostResponse(
//                 req,
//                 res,
//                 null, {
//                     local_errors: [{
//                         message: "Invalid Token."
//                     }]
//                 },
//                 2
//             );
//         }
//     })

// router
//     .route('/members/remove')
//     // Remove Member of a Group
//     .post((req, res) => {
//         var user_session = null;
//         if (req.headers && req.headers.access_token) {
//             var token = req.headers.access_token;
//             user_session = jwt.decode(token);
//         }
//         if (user_session && user_session.id) {
//             GroupDao.findOneByIdAndUpdate(req.body.group_id, {
//                     modified_by: user_session.id,
//                     $pullAll: {
//                         members: [req.body.user_id]
//                     }
//                 })
//                 .then((result) => {
//                     response_helper.sendGetResponse(req, res, result, null, 2)
//                 })
//                 .catch((err) => {
//                     response_helper.sendGetResponse(req, res, null, err, 2)
//                 });
//         } else {
//             response_helper.sendPostResponse(
//                 req,
//                 res,
//                 null, {
//                     local_errors: [{
//                         message: "Invalid Token."
//                     }]
//                 },
//                 2
//             );
//         }
//     })

module.exports = router;