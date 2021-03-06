var mongoose = require('mongoose')
var PostsActivitiesModelSchema = new mongoose.Schema({
    post_id: {
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

PostsActivitiesModelSchema.pre('save', function (callback) {
    this.date_created = new Date();
    callback();
});

// PostsActivitiesModelSchema.pre('findOneAndUpdate', function (callback) {
//     this.options.new = true;
//     this.options.runValidators = true;
//     this._update.date_modified = new Date();
//     callback();
// });

module.exports = mongoose.model('posts_activities', PostsActivitiesModelSchema)