const creator = require('./builder');
const config = require('../config');

module.exports = async (app, db) => {
    app.post('/register', (req, res) => {
        var person = creator(req.body);

        db.find({name: person.name}, (err, data) => {
            if(err) {
                res.send(`An error has occured: ${err}`)
            }

            if(data) {
                res.send(`already registered`);
                return;
            };

            db.insert(person, (err, newDoc) => {
                if(err) {
                    res.send(`An error has occured: ${err}`)
                }
                res.send(newDoc);
            });
        });
    });

    app.get('/db', (req, res) => {
        var auth = req.get('Authorization');

        if(config.auth.includes(auth)) {
            db.find({}, (err, data) => {
                res.send(data);
            });
        } else {
            res.send(`This is not the endpoint you are looking for.`);
        };
    });
};