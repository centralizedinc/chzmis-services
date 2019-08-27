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


app.use('/notification', require('./api/routes/notifications_router'));
app.use('/groups', require('./api/routes/group_router'));
app.use('/accounts', require('./api/routes/account_router'));
app.use('/connections', require('./api/routes/connections_router'));
app.use('/users', require('./api/routes/user_router'));
app.use('/post', require('./api/routes/post_router'));
app.use('/comments', require('./api/routes/comments_router'));
app.use('/', require('./api/routes/public_router'));


//Handle errors
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        error: err
    });
});

module.exports = app;