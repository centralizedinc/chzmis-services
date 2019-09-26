"use strict";

var router = require("express").Router();

const jwt = require('jsonwebtoken');

// DAO
var PostsDao = require('../dao/PostsDao');

// Utils
var ResponseHelper = require("../utils/response_helper");

var response_helper = new ResponseHelper('POSTS')


router
    .route('/')
    .get((req, res) => {
        PostsDao.findWithLimitSortDate(req.query.date, req.query.limit)
            .then((result) => {
                response_helper.sendGetResponse(req, res, result, null, 0)
            }).catch((err) => {
                response_helper.sendGetResponse(req, res, null, err, 0)
            });
    })
    .post((req, res) => {
        var post = req.body;
        post.author = jwt.decode(req.headers.access_token).account_id;
        console.log('post :', post);
        PostsDao.create(post)
            .then((result) => {
                response_helper.sendPostResponse(req, res, result, null, 0)
            }).catch((err) => {
                response_helper.sendPostResponse(req, res, null, err, 0)
            });
    })

router
    .route('/public')
    .get((req, res) => {
        PostsDao.findPublicWithLimitSortDateByParentId(req.query.date, req.query.limit)
            .then((result) => {
                response_helper.sendGetResponse(req, res, result, null, 1)
            }).catch((err) => {
                response_helper.sendGetResponse(req, res, null, err, 1)
            });
    })

router
    .route('/parent/:parent_id')
    .get((req, res) => {
        PostsDao.findWithLimitSortDateByParentId(req.params.parent_id, req.query.date, req.query.limit)
            .then((result) => {
                response_helper.sendGetResponse(req, res, result, null, 1)
            }).catch((err) => {
                response_helper.sendGetResponse(req, res, null, err, 1)
            });
    })

module.exports = router;