var mongoose = require('mongoose')
var CommentsActivitiesModelSchema = new mongoose.Schema({
    user: {
        type: String
    },
    module: {
        type: Number
        /**
         * 0 - POST
         * 1 - COMMENT
         * 2 - LIKE
         * 3 - UPDATE
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

CommentsActivitiesModelSchema.pre('save', function (callback) {
    this.date_created = new Date();
    callback();
});

// CommentsActivitiesModelSchema.pre('findOneAndUpdate', function (callback) {
//     this.options.new = true;
//     this.options.runValidators = true;
//     this._update.date_modified = new Date();
//     callback();
// });

module.exports = mongoose.model('comments_activities', CommentsActivitiesModelSchema)