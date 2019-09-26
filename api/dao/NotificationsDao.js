"use strict";

var router = require("express").Router();
const sgMail = require("@sendgrid/mail");
var ApplicationSettings = require("../utils/ApplicationSettings");

var NotificationsModel = require("../models/NotificationsModel");

class NotificationsDao {

  static setKeys(){
    sgMail.setApiKey(
      ApplicationSettings.getValue("SENDGRID_API_KEY") || process.env.SENDGRID_API_KEY
    );
    sgMail.setSubstitutionWrappers("{{", "}}");
  }

  // Email Notification
  static emailNotifications(new_notifications, templateId) {
    var notifications = new NotificationsModel(new_notifications);
    console.log("notification: " + JSON.stringify(notifications))
    // console.log("cb_notifications: " + JSON.stringify(cb_notifications))
    console.log("templateId: " + JSON.stringify(templateId))
    if (notifications.date_created) {
      notifications.date_created = new Date();
      return notifications.getSubstitutions(substitutions => {
        console.log("substitutions :", substitutions);
        var msg = {
          to: notifications.email,
          from: "chzmis@chz.com",
          // from: ApplicationSettings.getValue("NOTIFICATION_SENDER_EMAIL"),
          templateId: templateId,
          substitutions: substitutions
        };
        console.log("send message: " + JSON.stringify(msg))
        console.log('sgMail :', sgMail);
        sgMail.send(msg).then((result) => {
          console.log("email successfully sended: " + result)
        })

      });
    }
  }

}

module.exports = NotificationsDao

// // Get Notifications
// function getNotifications(cb_notifications) {
//   NotificationsModel.find((err, notifications) => {
//     cb_notifications(err, notifications);
//   });
// }

// function getNotificationsByConditions(conditions, cb_notifications) {
//   NotificationsModel.find(conditions, (err, notifications) => {
//     cb_notifications(err, notifications);
//   });
// }

// function getNotificationsById(id, cb_notifications) {
//   notificationsModel.findById(id, (err, notifications) => {
//     cb_notifications(err, notifications);
//   });
// }

// // Add Notifications
// function addNotifications(new_notifications, cb_notifications) {
//   var notifications = new NotificationsModel(new_notifications);
//   notifications.date_created = new Date();

//   notifications.save(err => {
//     cb_notifications(err, notifications);
//   });
// }



// // Modify Notifications
// function modifyNotifications(
//   conditions,
//   modified_notifications,
//   cb_notifications
// ) {
//   NotificationsModel.findOneAndUpdate(
//     conditions,
//     modified_notifications,
//     (err, notifications) => {
//       cb_notifications(err, notifications);
//     }
//   );
// }

// function modifyNotificationsById(id, modified_notifications, cb_notifications) {
//   NotificationsModel.findByIdAndUpdate(
//     id,
//     modified_notifications,
//     (err, notifications) => {
//       cb_notifications(err, notifications);
//     }
//   );
// }

// module.exports = {
//   getNotifications,
//   getNotificationsByConditions,
//   getNotificationsById,
//   addNotifications,
//   emailNotifications,
//   modifyNotifications,
//   modifyNotificationsById
// };