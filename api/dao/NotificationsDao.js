"use strict";

var router = require("express").Router();
const sgMail = require("@sendgrid/mail");
var ApplicationSettings = require("../utils/ApplicationSettings");

sgMail.setApiKey(
  ApplicationSettings.getValue("SENDGRID_API_KEY") ||
  "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"
);
sgMail.setSubstitutionWrappers("{{", "}}");

var NotificationsModel = require("../models/NotificationsModel");

// Get Notifications
function getNotifications(cb_notifications) {
  NotificationsModel.find((err, notifications) => {
    cb_notifications(err, notifications);
  });
}

function getNotificationsByConditions(conditions, cb_notifications) {
  NotificationsModel.find(conditions, (err, notifications) => {
    cb_notifications(err, notifications);
  });
}

function getNotificationsById(id, cb_notifications) {
  notificationsModel.findById(id, (err, notifications) => {
    cb_notifications(err, notifications);
  });
}

// Add Notifications
function addNotifications(new_notifications, cb_notifications) {
  var notifications = new NotificationsModel(new_notifications);
  notifications.date_created = new Date();

  notifications.save(err => {
    cb_notifications(err, notifications);
  });
}

// Email Notification
function emailNotifications(new_notifications, cb_notifications, templateId) {
  var notifications = new NotificationsModel(new_notifications);
  console.log("notification: " + JSON.stringify(notifications))
  console.log("cb_notifications: " + JSON.stringify(cb_notifications))
  console.log("templateId: " + JSON.stringify(templateId))
  if (notifications.date_created) notifications.date_created = new Date();
  notifications.getSubstitutions(substitutions => {
    console.log("substitutions :", substitutions);
    var msg = {
      to: notifications.email,
      from: "chzmis@chz.com",
      // from: ApplicationSettings.getValue("NOTIFICATION_SENDER_EMAIL"),
      templateId: templateId,
      substitutions: substitutions
    };
    sgMail.send(msg)
    // .then(result => {
    //   console.log("sgMail result :", result);
    //   var status = {
    //     module: notifications.module,
    //     status: "email sent",
    //     date: new Date()
    //   };
    //   // notifications.details.push(status);
    //   notifications.save(err => {
    //     console.log("ERROR1: " + JSON.stringify(err));
    //     cb_notifications(err, notifications);
    //   });
    // })
    // .catch(error => {
    //   console.log("ERROR2: " + JSON.stringify(error));
    //   var status = {
    //     module: notifications.module,
    //     action: notifications.action,
    //     company_name: notifications.company_name,
    //     product_name: notifications.product_name,
    //     status: "email didn't sent",
    //     date: new Date(),
    //     error: error
    //   };
    //   notifications.details.push(status);
    //   notifications.save(err => {
    //     console.log("ERROR3: " + JSON.stringify(err));
    //     cb_notifications(err, notifications);
    //   });
    // });
  });
}

// Modify Notifications
function modifyNotifications(
  conditions,
  modified_notifications,
  cb_notifications
) {
  NotificationsModel.findOneAndUpdate(
    conditions,
    modified_notifications,
    (err, notifications) => {
      cb_notifications(err, notifications);
    }
  );
}

function modifyNotificationsById(id, modified_notifications, cb_notifications) {
  NotificationsModel.findByIdAndUpdate(
    id,
    modified_notifications,
    (err, notifications) => {
      cb_notifications(err, notifications);
    }
  );
}

module.exports = {
  getNotifications,
  getNotificationsByConditions,
  getNotificationsById,
  addNotifications,
  emailNotifications,
  modifyNotifications,
  modifyNotificationsById
};