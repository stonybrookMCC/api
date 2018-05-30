const express = require('express');
const bodyParser = require('body-parser');
const database = require('nedb')
const app = express();

db = {};
db.registered = new database('./database/registered.db');
db.staff = new database('./database/staff.db');

app.use(bodyParser.urlencoded({ extended: true }));
require('./routes')(app, db, {});

const port = 8000;

app.listen(port, () => {
  db.registered.loadDatabase();
  db.staff.loadDatabase();
  
  console.log('API is online on port ' + port);
});