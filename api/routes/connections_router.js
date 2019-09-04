"use strict";

var router = require("express").Router();
const jwt = require('jsonwebtoken')

// DAO
var ConnectionsDao = require('../dao/ConnectionsDao');

// Utils
var ResponseHelper = require("../utils/response_helper");

var response_helper = new ResponseHelper('CONNECTIONS')


router
    .route('/')
    .get((req, res) => {
        console.log('jwt.decode(req.headers.access_token) :', jwt.decode(req.headers.access_token));
        ConnectionsDao.findAll()
            .then((result) => {
                response_helper.sendGetResponse(req, res, result, null, 0)
            }).catch((err) => {
                response_helper.sendGetResponse(req, res, null, err, 0)
            });
    })
    .post((req, res) => {
        var connection = req.body;
        const account = jwt.decode(req.headers.access_token);
        if (!connection.members) connection.members = []
        connection.members.push({
            account_id: account.account_id,
            role: 1
        })
        connection.created_by = account.account_id
        ConnectionsDao.create(connection)
            .then((result) => {
                response_helper.sendPostResponse(req, res, result, null, 0)
            }).catch((err) => {
                response_helper.sendPostResponse(req, res, null, err, 0)
            });
    })

router
    .route('/search')
    .get((req, res) => {
        const account = jwt.decode(req.headers.access_token);
        ConnectionsDao.findNameAndId()
            .then((result) => {
                result.forEach(dt => {
                    console.log('dt :', dt);
                    var i = dt.members.findIndex(
                        x => x.account_id.toString() === account.account_id.toString()
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
        const account = jwt.decode(req.headers.access_token);
        ConnectionsDao.connect({
            connection: req.body.connection,
            account_id: account.account_id
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
        ConnectionsDao.findOneInMember(req.params.account_id)
            .then((result) => {
                response_helper.sendGetResponse(req, res, result, null, 1)
            }).catch((err) => {
                response_helper.sendGetResponse(req, res, null, err, 1)
            });
    })

router
    .route('/:id')
    .post((req, res) => {
        const { name, members } = req.body;
        ConnectionsDao.modifyByID(req.params.id, { name, members })
            .then((result) => {
                response_helper.sendPostResponse(req, res, result, null, 3)
            }).catch((err) => {
                response_helper.sendPostResponse(req, res, null, err, 3)
            });
    })
    
module.exports = router;