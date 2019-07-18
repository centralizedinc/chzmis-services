
var mongoose = require('mongoose')
var CommentsModelSchema = new mongoose.Schema({
    author: {
        type: String
    },
    avatar: {
        type: String
    },
    message: {
        type: String
    },
    uploads: [],
    likes: [],
    dislikes: [],
    datetime: {
        type: Date,
        default: new Date()
    },
    group: {
        type: String
    },
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

module.exports = mongoose.model('accounts', CommentsModelSchema)