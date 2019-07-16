
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird')

function connect() {
    mongoose.connect(process.env.MONGODB_URI, {
        promiseLibrary: require('bluebird')
    })
        .then(() => {
            console.log('connection successful');
        }).catch((err) => console.error(err));
}

module.exports = {
    connect,
    db: mongoose
}