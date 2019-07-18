var mongoose = require('mongoose')
var GroupsActivitiesModelSchema = new mongoose.Schema({
    user: {
        type: String
    },
    module: {
        type: Number
        /**
         * 0 - CREATE
         * 1 - UPDATE
         * 2 - NEW MEMBER
         * 3 - FAVORITE
         * 4 - DELETE
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

GroupsActivitiesModelSchema.pre('save', function (callback) {
    this.date_created = new Date();
    callback();
});

// GroupsActivitiesModelSchema.pre('findOneAndUpdate', function (callback) {
//     this.options.new = true;
//     this.options.runValidators = true;
//     this._update.date_modified = new Date();
//     callback();
// });

module.exports = mongoose.model('groups_activities', GroupsActivitiesModelSchema)