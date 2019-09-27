"use strict";

const router = require("express").Router();

const jwt = require('jsonwebtoken');

// DAO
const PostsDao = require('../dao/PostsDao');
const AccountDao = require('../dao/AccountDao');

// Utils
const ResponseHelper = require("../utils/response_helper");

const response_helper = new ResponseHelper('POSTS')


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
        console.log('req.query :', req.query);
        PostsDao.findPublicWithLimitSortDateByParentId(req.query.last_date, req.query.limit)
            .then((result) => {
                response_helper.sendGetResponse(req, res, result, null, 1)
            }).catch((err) => {
                response_helper.sendGetResponse(req, res, null, err, 1)
            });
    })

router
    .route('/parent/:parent_id')
    .get((req, res) => {
        console.log('req.query :', req.query);
        // For saving last update in notification
        const account_id = jwt.decode(req.headers.access_token).account_id;
        if (req.query.refresh) AccountDao.saveLastUpdate(account_id, req.query.type, req.params.parent_id);
        // Get posts
        PostsDao.findWithLimitSortDateByParentId(req.params.parent_id, req.query.last_date, req.query.limit)
            .then((result) => {
                response_helper.sendGetResponse(req, res, result, null, 1)
            }).catch((err) => {
                response_helper.sendGetResponse(req, res, null, err, 1)
            });
    })

module.exports = router;