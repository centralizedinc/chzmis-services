var mongoose = require('mongoose')
var CommentsModelSchema = new mongoose.Schema({
    id: {
        type: String
    },
    post_id: {
        type: String
    },
    author: {
        type: String
    },
    message: {
        type: String
    },
    uploads: [],
    likes: [],
    dislikes: [],
    date_created: {
        type: Date,
        default: new Date()
    },
    date_modified: {
        type: Date,
        default: new Date()
    }
})

CommentsModelSchema.pre('save', function (callback) {
    this.date_created = new Date();
    this.date_modified = new Date();
    callback();
});

CommentsModelSchema.pre('findOneAndUpdate', function (callback) {
    this.options.new = true;
    this.options.runValidators = true;
    this._update.date_modified = new Date();
    callback();
});

module.exports = mongoose.model('comments', CommentsModelSchema)