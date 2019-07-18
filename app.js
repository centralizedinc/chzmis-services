const app = (require('express'))()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

var cors = require('cors')

app.use(cors());
app.options('*', cors())

require('./api/utils/db_helper').connect();

app.use('/groups', require('./api/routes/group_router'));
app.use('/accounts', require('./api/routes/account_router'));

module.exports = app;