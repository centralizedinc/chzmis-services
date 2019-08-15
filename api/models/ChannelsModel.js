var mongoose = require('mongoose')
var ChannelsModelSchema = new mongoose.Schema({
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
    categories: {
        type: Number
        /**
         * 0 - Food
         * 1 - Education
         * 2 - Business
         * 3 - Technologies
         * 4 - Fitness
         */
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

ChannelsModelSchema.pre('save', function (callback) {
    this.date_created = new Date();
    this.date_modified = new Date();
    callback();
});

ChannelsModelSchema.pre('findOneAndUpdate', function (callback) {
    this.options.new = true;
    this.options.runValidators = true;
    this._update.date_modified = new Date();
    callback();
});

module.exports = mongoose.model('channels', ChannelsModelSchema)