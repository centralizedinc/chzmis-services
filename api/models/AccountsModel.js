var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs');

var AccountModelSchema = new mongoose.Schema({
    email: {
        type: String,
        // required: [true, 'Email is a required field'],
        // unique: true
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
    //Hashes the password sent by the user for login and checks if the hashed password stored in the 
    //database matches the one sent. Returns true if it does else false.
    return await bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('accounts', AccountModelSchema)