
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird')

var SettingsDao = require('../dao/SettingsDao');
var ApplicationSettings = require('./ApplicationSettings');

function connect() {
    mongoose.connect(process.env.MONGODB_URI || require('./constant_helper').mongodb_uri, {
        promiseLibrary: require('bluebird'),
        useNewUrlParser: true
    })
        .then(() => {
            console.log('connection successful');

            /****** Setup Application Variables ******/
            return SettingsDao.getSettings()
        })
        .then((params) => {
            ApplicationSettings.setApplicationVariables(params)
            console.log('Initialized Application Settings: ' + JSON.stringify(ApplicationSettings.getApplicationVariables()));

            /****** Setup Authentication ******/
            require('../auth/auth')
            require('../auth/google')
            require('../auth/facebook')
        }).catch((err) => console.error(err));
}

module.exports = {
    connect,
    db: mongoose
}