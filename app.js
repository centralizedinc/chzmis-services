const app = (require('express'))()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

var cors = require('cors')

app.use(cors());
app.options('*', cors())

require('./api/utils/db_helper').connect();


module.exports = app;