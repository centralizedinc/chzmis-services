"use strict";

var router = require("express").Router();

// DAO
var UserDao = require('../dao/UserDao');

// Utils
var ResponseHelper = require("../utils/response_helper");

var response_helper = new ResponseHelper("USER")

// JWT
var jwt = require('jsonwebtoken')


router
    // Get user
    .route("/")
    .get((req, res) => {
        // var user_session = null;
        // if (req.headers && req.headers.access_token) {
        //     var token = req.headers.access_token;
        //     user_session = jwt.decode(token);
        // }
        if (user_session && user_session.account_id) {
            UserDao.findOneByAccountID(user_session.account_id)
                .then((result) => {
                    response_herlper.sendGetResponse(req, res, result, null, 0)
                }).catch((err) => {
                    response_helper.sendGetResponse(req, res, null, err, 0)
                })
        } else {
            response_helper.sendPostResponse(req, res, null, {
                local_errors: [{
                    message: "Invalid Token."
                }]
            })
        }

    })
    .post((req, res) => {
        var new_user = req.body;
        var user_id = "";
        // if (req.headers && req.headers.access_token) {
        //     var token = req.headers.access_token;
        //     if (jwt.decode(token)) {
        //         user_id = jwt.decode(token).id
        //         new_user.created_by = user_id;
        //     }
        // }
        UserDao.create(new_user)
            .then((result) => {
                response_helper.sendPostResponse(req, res, result, null, 0)
            }).catch((err) => {
                response_helper.sendPostResponse(req, res, null, err, 0)
            })
    });

router
    .route("/confirmation")
    .post((req, res) => {
        var user = req.body

        UserDao.findOneByAccountID(id).then((result) => {
            console.log("findOneByAccountID result data: " + JSON.stringify(result))

        })
    })

router.route('/accountid')
    .get((req, res) => {
        UserDao.findOneByAccountID(req.query.account_id)
            .then((result) => {
                response_helper.sendGetResponse(req, res, result, null, 2)
            }).catch((err) => {
                response_helper.sendGetResponse(req, res, null, err, 2)
            });
    })
    .post((req, res) => {
        UserDao.find({
            account_id: {
                $in: req.body.accounts
            }
        })
            .then((result) => {
                response_helper.sendPostResponse(req, res, result, null, 2)
            }).catch((err) => {
                response_helper.sendPostResponse(req, res, null, err, 2)
            });
    })

router.route('/details')
    .get((req, res) => {
        UserDao.getUserDetails()
            .then((result) => {
                response_helper.sendGetResponse(req, res, result, null, 3)
            }).catch((err) => {
                response_helper.sendGetResponse(req, res, null, err, 3)
            });
    })

    router
    .route("/:id")
    .get((req, res) => {
        UserDao.getAccountById(req.params.id, (err, account_id) => {
            response_helper.sendGetResponse(
                req,
                res,
                account_id,
                err,
                response_helper.ACCOUNT,
                3
            );
        });
    })
    .post((req, res) => {
        var user_session = null;
        if (req.headers && req.headers.access_token) {
            var token = req.headers.access_token;
            user_session = jwt.decode(token);
        }
        if (user_session && user_session.id) {
            var data = req.body;
            data.modified_by = user_session.id;
            UserDao.modifyAccountById(req.params.id, req.body, (err, account_id) => {
                response_helper.sendPostResponse(
                    req,
                    res,
                    account_id,
                    err,
                    response_helper.ACCOUNT,
                    3
                );
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
                response_helper.CASE,
                0
            );
        }
    });
module.exports = router