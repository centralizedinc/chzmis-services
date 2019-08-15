var mongoose = require('mongoose')
var ChannelsActivitiesModelSchema = new mongoose.Schema({
    channel_id: {
        type: String
    },
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

ChannelsActivitiesModelSchema.pre('save', function (callback) {
    this.date_created = new Date();
    callback();
});

// ChannelsActivitiesModelSchema.pre('findOneAndUpdate', function (callback) {
//     this.options.new = true;
//     this.options.runValidators = true;
//     this._update.date_modified = new Date();
//     callback();
// });

module.exports = mongoose.model('channels_activities', ChannelsActivitiesModelSchema)