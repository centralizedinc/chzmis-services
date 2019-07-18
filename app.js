const app = (require('express'))()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

var cors = require('cors')

app.use(cors());
app.options('*', cors())

/****** Connect Database ******/
require('./api/utils/db_helper').connect();

/****** Setup Authentication ******/
require('./api/auth/auth')

app.use('/', require('./api/routes/public_router'));
app.use('/groups', require('./api/routes/group_router'));
app.use('/accounts', require('./api/routes/account_router'));


//Handle errors
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({ error: err });
});

module.exports = app;