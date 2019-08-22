'use strict'

var mongoose = require("mongoose");

var NotificationsModelSchema = new mongoose.Schema({
    module: {
        type: String
    },
    email: {
        type: String,
        required: [true, 'Email is a required field']
    },
    date_created: {
        type: Date,
        default: new Date()
    },
    substitutions: {}
});

NotificationsModelSchema.pre('findOneAndUpdate', function (callback) {
    this.options.new = true;
    this.options.runValidators = true;
    this._update.date_modified = new Date();
    callback();
});

NotificationsModelSchema.methods.getSubstitutions = function (cb) {
    var notification = this;
    var substitutions = Object.assign({
        // module: notification.module,
        // case_number: notification.case_number,
        // action: notification.action,
        // log_date: formatDate(notification.log_date),
        email: notification.email,
        // name: notification.name,
        // company_name: notification.company_name,
        // product_name: notification.product_name,
        // details: notification.details,
        date_created: formatDate(notification.date_created),
        // date_modified: formatDate(notification.date_modified),
        // confirmation_url: notification.confirmation_url
    }, notification.substitutions)
    console.log("model subs: " + JSON.stringify(substitutions))
    cb(substitutions)
}

function formatDate(date) {
    return new Date(date).toLocaleString("en-US", {
        hour12: true,
        year: "numeric",
        month: "long",
        day: "2-digit"
    })
}

module.exports = mongoose.model("notifications", NotificationsModelSchema);