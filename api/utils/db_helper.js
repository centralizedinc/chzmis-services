
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird')

var SettingsDao = require('../dao/SettingsDao');
var ApplicationSettings = require('./ApplicationSettings');

function connect() {
    mongoose.connect(process.env.MONGODB_URI || "mongodb://heroku_dwdl1xnt:9j2bt4hk1qmch2jtu4q2ctc4pc@ds263816.mlab.com:63816/heroku_dwdl1xnt", {
        promiseLibrary: require('bluebird'),
        useNewUrlParser: true
    })
        .then(() => {
            console.log('connection successful');
            return SettingsDao.getSettings()
        })
        .then((params) => {
            ApplicationSettings.setApplicationVariables(params)
            console.log('Initialized Application Settings: ' + JSON.stringify(ApplicationSettings.getApplicationVariables()));

        }).catch((err) => console.error(err));
}

module.exports = {
    connect,
    db: mongoose
}