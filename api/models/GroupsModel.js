var mongoose = require('mongoose')
var GroupModelSchema = new mongoose.Schema({
    name: {
        type: String
    },
    status: {
        type: Number,
        default: 1
        /**
         * 0 - Inactive
         * 1 - Active
         */
    },
    favorites: [],
    members: [],
    created_by: {
        type: String
    },
    date_created: {
        type: Date,
        default: new Date()
    },
    modified_by: {
        type: String
    },
    date_modified: {
        type: Date,
        default: new Date()
    }
})

GroupModelSchema.pre('save', function (callback) {
    this.date_created = new Date();
    this.date_modified = new Date();
    callback();
});

GroupModelSchema.pre('findOneAndUpdate', function (callback) {
    this.options.new = true;
    this.options.runValidators = true;
    this._update.date_modified = new Date();
    callback();
});

module.exports = mongoose.model('groups', GroupModelSchema)