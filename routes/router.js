const creator = require('./builder');

module.exports = async (app, db) => {
    app.post('/register', (req, res) => {
        var person = creator(req.body);

        db.find({name: person.name}, (err, data) => {
            if(err) {
                res.send(`An error has occured: ${err}`)
            }

            if(data[0]) {
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
};