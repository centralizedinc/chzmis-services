"use strict";

var router = require("express").Router();

// DAO
var ConnectionsDao = require('../dao/ConnectionsDao');

// Utils
var ResponseHelper = require("../utils/response_helper");

var response_helper = new ResponseHelper('GROUP')


router
    .route('/')
    .get((req, res) => {
        ConnectionsDao.findOneInMember()
            .then((result) => {
                response_helper.sendGetResponse(req, res, result, null, 0)
            }).catch((err) => {
                response_helper.sendGetResponse(req, res, null, err, 0)
            });
    })

module.exports = router;