"use strict";

const router = require("express").Router();
const passport = require('passport');

var UserDao = require('../dao/UserDao')

router
    .route('/signup')
    .post(passport.authenticate('signup', { session: false }), (req, res) => {
        var data = req.body;
        data.account_id = req.user._id;
        UserDao.create(data)
            .then((result) => {
                res.json(result)
            }).catch((err) => {
                res.json(err)
            });
    })

module.exports = router;