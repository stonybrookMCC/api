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
  db.registered.persistence.setAutocompactionInterval(10000);

  db.staff.loadDatabase();
  db.staff.persistence.setAutocompactionInterval(10000);
  
  console.log('API is online on port ' + port);
});