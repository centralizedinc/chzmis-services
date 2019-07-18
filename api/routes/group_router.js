"use strict";

var router = require("express").Router();

// DAO
var GroupDao = require('../dao/GroupDao');

// Utils
var ResponseHelper = require("../utils/response_helper");

var response_helper = new ResponseHelper('GROUP')
//Jwt
var jwt = require('jsonwebtoken')

/******* GROUPS *******/

router
    .route('/')
    // Get All groups of user
    .get((req, res) => {
        var user_session = null;
        if (req.headers && req.headers.access_token) {
            var token = req.headers.access_token;
            user_session = jwt.decode(token);
        }
        if (user_session && user_session.id) {
            GroupDao.findOneInMember(user_session.id)
                .then((result) => {
                    response_helper.sendGetResponse(req, res, result, null, 0)
                }).catch((err) => {
                    response_helper.sendGetResponse(req, res, null, err, 0)
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
    })
    // Add new Group
    .post((req, res) => {
        var user_session = null;
        if (req.headers && req.headers.access_token) {
            var token = req.headers.access_token;
            user_session = jwt.decode(token);
        }
        if (user_session && user_session.id) {
            var group = req.body;
            group.created_by = user_session.id
            group.members.push(user_session.id)
            group.status = 1; // set as active
            GroupDao.create(group)
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
        var user_session = null;
        if (req.headers && req.headers.access_token) {
            var token = req.headers.access_token;
            user_session = jwt.decode(token);
        }
        if (user_session && user_session.id) {
            GroupDao.findOneByIdAndUpdate(req.body.group_id, {
                modified_by: user_session.id,
                favorites: {
                    $push: user_session.id
                }
            })
                .then((result) => {
                    response_helper.sendGetResponse(req, res, result, null, 2)
                })
                .catch((err) => {
                    response_helper.sendGetResponse(req, res, null, err, 2)
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
                2
            );
        }
    })

router
    .route('/favorites/remove')
    // Remove Favorites
    .post((req, res) => {
        var user_session = null;
        if (req.headers && req.headers.access_token) {
            var token = req.headers.access_token;
            user_session = jwt.decode(token);
        }
        if (user_session && user_session.id) {
            GroupDao.findOneByIdAndUpdate(req.body.group_id, {
                modified_by: user_session.id,
                $pullAll: {
                    favorites: [user_session.id]
                }
            })
                .then((result) => {
                    response_helper.sendGetResponse(req, res, result, null, 2)
                })
                .catch((err) => {
                    response_helper.sendGetResponse(req, res, null, err, 2)
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
                2
            );
        }
    })

    
/****** MEMBERS ******/

router
    .route('/members/new')
    // Add New Member of a Group
    .post((req, res) => {
        var user_session = null;
        if (req.headers && req.headers.access_token) {
            var token = req.headers.access_token;
            user_session = jwt.decode(token);
        }
        if (user_session && user_session.id) {
            GroupDao.findOneByIdAndUpdate(req.body.group_id, {
                modified_by: user_session.id,
                members: {
                    $push: req.body.user_id
                }
            })
                .then((result) => {
                    response_helper.sendGetResponse(req, res, result, null, 2)
                })
                .catch((err) => {
                    response_helper.sendGetResponse(req, res, null, err, 2)
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
                2
            );
        }
    })

router
    .route('/members/remove')
    // Remove Member of a Group
    .post((req, res) => {
        var user_session = null;
        if (req.headers && req.headers.access_token) {
            var token = req.headers.access_token;
            user_session = jwt.decode(token);
        }
        if (user_session && user_session.id) {
            GroupDao.findOneByIdAndUpdate(req.body.group_id, {
                modified_by: user_session.id,
                $pullAll: {
                    members: [req.body.user_id]
                }
            })
                .then((result) => {
                    response_helper.sendGetResponse(req, res, result, null, 2)
                })
                .catch((err) => {
                    response_helper.sendGetResponse(req, res, null, err, 2)
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
                2
            );
        }
    })

module.exports = router;