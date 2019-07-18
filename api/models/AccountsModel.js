var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs');

var AccountModelSchema = new mongoose.Schema({
    avatar: {
        type: String
    },
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
    contacts: {
        email: {
            type: String,
            // required: [true, 'Email is a required field'],
            // unique: true
        },
        phone: {
            type: String
        }
    },
    address: {
        type: String
    },
    groups: [],
    username: {
        type: String,
        // unique: true,
        // required: [true, 'Username is a required field'],
    },
    password: {
        type: String,
        // required: [true, 'Password is a required field']
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

    // Break out if the password hasn't changed
    if (!account.isModified("password")) return callback();

    // Password changed so we need to hash it
    const hash = await bcrypt.hashSync(account.password, 10);
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
    //Hashes the password sent by the user for login and checks if the hashed password stored in the 
    //database matches the one sent. Returns true if it does else false.
    return await bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('accounts', AccountModelSchema)