"use strict";

var router = require("express").Router();
const jwt = require("jsonwebtoken");

// DAO
var CommentsDao = require('../dao/CommentsDao');

// Utils
var ResponseHelper = require("../utils/response_helper");

var response_helper = new ResponseHelper('COMMENTS')


router
    .route('/')
    .post((req, res) => {
        var comment = req.body;
        comment.author = jwt.decode(req.headers.access_token).account_id;
        CommentsDao.create(comment)
            .then((result) => {
                response_helper.sendPostResponse(req, res, result, null, 0)
            }).catch((err) => {
                response_helper.sendPostResponse(req, res, null, err, 0)
            });
    })

router
    .route('/posts')
    .post((req, res) => {
        CommentsDao.findByPostIds(req.body)
            .then((result) => {
                response_helper.sendPostResponse(req, res, result, null, 1)
            }).catch((err) => {
                response_helper.sendPostResponse(req, res, null, err, 1)
            });
    })

router.route('/postid/:post_id')
    .get((req, res) => {
        CommentsDao.findWithLimitSortDateByPostId(req.params.post_id, req.query.date, req.query.limit)
            .then((result) => {
                response_helper.sendGetResponse(req, res, result, null, 0)
            }).catch((err) => {
                response_helper.sendGetResponse(req, res, null, err, 0)
            });
    })

module.exports = router;