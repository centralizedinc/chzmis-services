const app = (require('express'))()
const bodyParser = require('body-parser')
const passport = require('passport');

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

var cors = require('cors')

app.use(cors());
app.options('*', cors())

/****** Connect Database ******/
require('./api/utils/db_helper').connect();

app.use('/', require('./api/routes/public_router'));
app.use('/notification', require('./api/routes/notifications_router'));
app.use('/groups', passport.authenticate('jwt', {
    session: false
}), require('./api/routes/group_router'));
app.use('/accounts', passport.authenticate('jwt', {
    session: false
}), require('./api/routes/account_router'));


//Handle errors
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        error: err
    });
});

module.exports = app;