const creator = require('./builder');

module.exports = async (app, db) => {
    app.post('/register', (request, response) => {
        var person = creator(request.body);

        db.registered.find({name: person.name}, (err, data) => {
            if(err) {
                response.status(500);
                response.send(`An error has occured: ${err}`)
            }

            if(data[0]) {
                response.status(403);
                response.send(`already registered`);
                return;
            };

            db.registered.insert(person, (err, newDoc) => {
                if(err) {
                    response.status(500);
                    response.send(`An error has occured: ${err}`)
                }
                response.send(newDoc);
            });
        });
    });

    app.get('/db', (request, response) => {
        var authorization = request.get('Authorization');

        db.staff.find({}, (err, data) => {
            var authorized = [];
            var x;

            for(var i = 0; i < data.length; i++) {
                authorized.push(data[i].authorizeCode);
            }

            if(authorized.includes(authorization)) {
                db.registered.find({}, (err, data) => {
                    response.status(200);
                    response.send(data);
                });
            } else {
                response.status(401);
                response.send(`This is not the endpoint you are looking for.`);
            };
        });
    });
};