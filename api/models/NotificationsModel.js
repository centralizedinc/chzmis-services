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
        account_id: notification.id,
        email: notification.email,
        date_created: formatDate(notification.date_created)
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