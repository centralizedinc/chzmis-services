"use strict";

var router = require("express").Router();

// DAO
var CommentsDao = require('../dao/CommentsDao');

// Utils
var ResponseHelper = require("../utils/response_helper");

var response_helper = new ResponseHelper('COMMENTS')


router
    .route('/')
    .post((req, res) => {
        CommentsDao.create(req.body)
            .then((result) => {
                response_helper.sendPostResponse(req, res, result, null, 0)
            }).catch((err) => {
                response_helper.sendPostResponse(req, res, null, err, 0)
            });
    })

router
    .route('/ids')
    .post((req, res) => {
        CommentsDao.findByIds(req.body)
            .then((result) => {
                response_helper.sendPostResponse(req, res, result, null, 1)
            }).catch((err) => {
                response_helper.sendPostResponse(req, res, null, err, 1)
            });
    })

module.exports = router;