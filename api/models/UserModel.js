var mongoose = require('mongoose')

var UserModelSchema = new mongoose.Schema({
    account_id: {
        type: String
    },
    avatar: {},
    name: {
        first: {
            type: String
        },
        middle: {
            type: String
        },
        last: {
            type: String
        },
        nickname: {
            type: String
        }
    },
    address: {
        type: String
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    birthdate: {
        type: Date
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

UserModelSchema.pre('save', function (callback) {
    this.date_created = new Date();
    this.date_modified = new Date();
    callback();
});

UserModelSchema.pre('findOneAndUpdate', function (callback) {
    this.options.new = true;
    this.options.runValidators = true;
    this._update.date_modified = new Date();
    callback();
});

module.exports = mongoose.model('users', UserModelSchema)