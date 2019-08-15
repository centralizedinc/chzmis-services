var mongoose = require('mongoose')
var ConnectionsModelSchema = new mongoose.Schema({
    id: {
        type: String
    },
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
    members: [], // role: account_id
    topics: {
        type: String
    },
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

ConnectionsModelSchema.pre('save', function (callback) {
    this.date_created = new Date();
    this.date_modified = new Date();
    callback();
});

ConnectionsModelSchema.pre('findOneAndUpdate', function (callback) {
    this.options.new = true;
    this.options.runValidators = true;
    this._update.date_modified = new Date();
    callback();
});

module.exports = mongoose.model('connections', ConnectionsModelSchema)