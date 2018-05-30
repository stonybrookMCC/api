const creator = require('./builder');

module.exports = async (app, db) => {
    app.post('/register', (req, res) => {
        var person = creator(req.body);

        db.registered.find({name: person.name}, (err, data) => {
            if(err) {
                res.send(`An error has occured: ${err}`)
            }

            if(data[0]) {
                res.send(`already registered`);
                return;
            };

            db.registered.insert(person, (err, newDoc) => {
                if(err) {
                    res.send(`An error has occured: ${err}`)
                }
                res.send(newDoc);
            });
        });
    });

    app.get('/db', (req, res) => {
        var auth = req.get('Authorization');

        db.staff.find({type: "Admin"}, (err, data) => {
            var authorized = [];
            var x;

            for(var i = 0; i < data.length; i++) {
                authorized.push(data[i].auth);
            }

            if(authorized.includes(auth)) {
                db.registered.find({}, (err, data) => {
                    res.send(data);
                });
            } else {
                res.send(`This is not the endpoint you are looking for.`);
            };
        });
    });
};