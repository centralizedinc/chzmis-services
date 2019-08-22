"use strict";

var router = require("express").Router();

// DAO
var NotificationsDao = require("../dao/NotificationsDao");

// Utils
var response_helper = require("../utils/response_helper");
var ApplicationSettings = require("../utils/ApplicationSettings");

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
  NotificationsDao.emailNotifications(
    req.body,
    ApplicationSettings.getValue("REGISTRATION_EMAIL_TEMPLATE"),
    "746f8913-1ea5-4f5b-a5e9-69574462137e",
    (err, notifications) => {
      console.log("response helper notification: " + JSON.stringify(notification))
      response_helper.sendPostResponse(req, res, notifications, null, 0);
    }
  );
});

module.exports = router;