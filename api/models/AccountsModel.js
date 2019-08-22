var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs');

var AccountModelSchema = new mongoose.Schema({
    id: {
        type: String
    },
    email: {
        type: String,
        // required: [true, 'Email is a required field'],
        // unique: true
    },
    method: {
        type: String,
        enum: ['local', 'google', 'facebook']
    },
    password: {
        type: String,
        // required: [true, 'Password is a required field']
    },
    favorites: {
        type: String
    },
    nicknames: {
        type: String
    },
    status: {
        type: Number,
        default: 0
        /**
         * 0 - registered
         * 1 - confirmed 
         */
    },
    google_id: {
        type: String
    },
    facebook_id: {
        type: String
    },
    session_token: {
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

AccountModelSchema.pre('save', async function (callback) {
    var account = this;
    account.date_created = new Date();
    account.date_modified = new Date();

    const salt = bcrypt.genSaltSync(5);
    const hash = bcrypt.hashSync(account.password, salt)
    account.password = hash;
    callback();
});

AccountModelSchema.pre('findOneAndUpdate', function (callback) {
    this.options.new = true;
    this.options.runValidators = true;
    this._update.date_modified = new Date();
    callback();
});

AccountModelSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('accounts', AccountModelSchema)