const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const database = require('nedb'),
    db = new database({
        filename: './database/registered.db'
    });

app.use(bodyParser.urlencoded({ extended: true }));
require('./routes')(app, db, {});

const port = 8000;

app.listen(port, () => {
  db.loadDatabase();
  console.log('API is online on port ' + port);
});