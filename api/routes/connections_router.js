"use strict";

var router = require("express").Router();

// DAO
var ConnectionsDao = require('../dao/ConnectionsDao');

// Utils
var ResponseHelper = require("../utils/response_helper");

var response_helper = new ResponseHelper('CONNECTIONS')
const temp_account_id = '3'

router
    .route('/')
    .post((req, res) => {
        ConnectionsDao.create(req.body)
            .then((result) => {
                response_helper.sendPostResponse(req, res, result, null, 0)
            }).catch((err) => {
                response_helper.sendPostResponse(req, res, null, err, 0)
            });
    })

router
    .route('/search')
    .get((req, res) => {
        ConnectionsDao.findNameAndId()
            .then((result) => {
                result.forEach(dt => {
                    var i = dt.members.findIndex(
                        x => x.account_id.toString() === temp_account_id.toString()
                    );
                    dt.connected = i > -1;
                    dt.members = null;
                });
                response_helper.sendGetResponse(req, res, result, null, 2)
            }).catch((err) => {
                response_helper.sendGetResponse(req, res, null, err, 2)
            });
    })

router
    .route('/connect')
    .post((req, res) => {
        ConnectionsDao.connect({
            connection: req.body.connection,
            account_id: temp_account_id
        })
            .then((result) => {
                response_helper.sendPostResponse(req, res, result, null, 3)
            }).catch((err) => {
                response_helper.sendPostResponse(req, res, null, err, 3)
            });
    })

router
    .route('/member/:account_id')
    .get((req, res) => {
        console.log('req.params.account_id.toString() :', req.params.account_id.toString());
        ConnectionsDao.findOneInMember(req.params.account_id)
            .then((result) => {
                response_helper.sendGetResponse(req, res, result, null, 1)
            }).catch((err) => {
                response_helper.sendGetResponse(req, res, null, err, 1)
            });
    })

module.exports = router;