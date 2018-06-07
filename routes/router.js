const creator = require('./builder').makeRegistered;
const authenticate = require('./builder').checkAuthorization;

module.exports = async (app, db) => {

    app.get('/', (request, response) => {
        response.status(404);
        response.send('Nope');
    });

    app.post('/register', (request, response) => {
        var builder = creator(request.body);

        db.registered.find({"person.name": builder.person.name}, (err, data) => {
            if(err) {
                response.status(500);
                console.log(`${Date.now()} - ${err}`);
                response.send(`An error has occured, logged in console.`);
            }

            if(data[0]) {
                response.status(403);
                response.send(`already registered`);
                return;
            };

            db.registered.insert(builder, (err, newDoc) => {
                if(err) {
                    response.status(500);
                    console.log(`${Date.now()} - ${err}`);
                    response.send(`An error has occured, logged in console.`);
                }
                response.send(newDoc);
            });
        });
    });

    app.get('/db', async (request, response) => {
        var authorization = request.get('Authorization');
        var authorized = await authenticate(db, authorization);

        if(authorized) {
            db.registered.find({}, (err, data) => {
                response.status(200);
                response.send(data);
            });
        } else {
            response.status(401);
            response.send(`This is not the endpoint you are looking for.`);
        };
    });

    app.put('/register', (request, response) => {
        var builder = creator(request.body);

        db.registered.find({"person.name": builder.person.name}, (err, data) => {
            if (data[0]) {
                db.registered.update({"person.name": builder.person.name}, {$set: builder}, (err, replaced) => {
                    response.status(200);
                    response.send(`Updated ${builder.person.name}'s information`);
                });
            } else {
                response.send(`No user was found, make sure you're using the right name`);
            }
        });
    });
};