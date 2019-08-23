"use strict";

var router = require("express").Router();

// DAO
var ConnectionsDao = require('../dao/ConnectionsDao');

// Utils
var ResponseHelper = require("../utils/response_helper");

var response_helper = new ResponseHelper('GROUP')


router
    .route()
    .post((req, res) => {
        ConnectionsDao.create(req.body)
            .then((result) => {
                response_helper.sendGetResponse(req, res, result, null, 0)
            }).catch((err) => {
                response_helper.sendGetResponse(req, res, null, err, 0)
            });
    })

router
    .route('/:account_id')
    .get((req, res) => {
        ConnectionsDao.findOneInMember(req.query.account_id)
            .then((result) => {
                response_helper.sendGetResponse(req, res, result, null, 0)
            }).catch((err) => {
                response_helper.sendGetResponse(req, res, null, err, 0)
            });
    })

module.exports = router;