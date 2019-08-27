"use strict";

var router = require("express").Router();

// DAO
var NotificationsDao = require("../dao/NotificationsDao");

// Utils
var ApplicationSettings = require("../utils/ApplicationSettings");
var ResponseHelper = require("../utils/response_helper");

var response_helper = new ResponseHelper('NOTIFICATION')

router.route("/").get((req, res) => {
  NotificationsDao.getNotifications((err, notifications) => {
    response_helper.sendGetResponse(
      res,
      notifications,
      err,
      response_helper.NOTIFICATION,
      "00"
    );
  });
});

router.route("/registration").post((req, res) => {
  console.log('ApplicationSettings.getValue("REGISTRATION_EMAIL_TEMPLATE") :', ApplicationSettings.getValue("REGISTRATION_EMAIL_TEMPLATE"));
  NotificationsDao.emailNotifications(
    req.body,
    ApplicationSettings.getValue("REGISTRATION_EMAIL_TEMPLATE"),
    // "d-1bb8926aad60421c91a2a883b963944c",
    (err, notifications) => {
      console.log('err :', err);
      console.log("response helper notification: " + JSON.stringify(notifications))
      response_helper.sendPostResponse(req, res, notifications, null, 0);
    }
  );
});

module.exports = router;