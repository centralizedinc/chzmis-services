var mongoose = require('mongoose')
var AccountsActivitiesModelSchema = new mongoose.Schema({
    user: {
        type: String
    },
    module: {
        type: Number
        /**
         * 0 - LOGIN
         * 1 - LOGOUT
         * 2 - REGISTER
         * 3 - UPDATE
         * 4 - CHANGE PASSWORD
         */
    },
    details: {
        type: Object
        // other details
    },
    date_created: {
        type: Date,
        default: new Date()
    }
})

AccountsActivitiesModelSchema.pre('save', function (callback) {
    this.date_created = new Date();
    callback();
});

// AccountsActivitiesModelSchema.pre('findOneAndUpdate', function (callback) {
//     this.options.new = true;
//     this.options.runValidators = true;
//     this._update.date_modified = new Date();
//     callback();
// });

module.exports = mongoose.model('accounts_activities', AccountsActivitiesModelSchema)