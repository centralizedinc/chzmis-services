var mongoose = require('mongoose')
var PostsModelSchema = new mongoose.Schema({
    author: {
        type: String
    },
    title: {
        type: String
    },
    message: {
        type: String
    },
    uploads: [],
    likes: [],
    dislikes: [],
    is_public: {
        type: Boolean,
        default: false
    },
    parent_id: {
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

PostsModelSchema.pre('save', function (callback) {
    this.date_created = new Date();
    this.date_modified = new Date();
    callback();
});

PostsModelSchema.pre('findOneAndUpdate', function (callback) {
    this.options.new = true;
    this.options.runValidators = true;
    this._update.date_modified = new Date();
    callback();
});

module.exports = mongoose.model('posts', PostsModelSchema)