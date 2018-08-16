const creator = require('./builder').makeRegistered;
const authenticate = require('./builder').checkAuthorization;
const invoice = require('./builder').sendInvoice;

var jsonexport = require('jsonexport');

module.exports = async (app, db) => {
    app.get('/', (request, response) => {
        response.status(404);
        response.send('Nope');
    });

    app.post('/register', (request, response) => {
        var builder = creator(request.body);

        db.registered.find({"studentName": builder.studentName}, (err, data) => {
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
                response.status(201)
                response.send(newDoc);
                if (!builder.paymentID) invoice(builder);
            });
        });
    });

    app.get('/db', async (request, response) => {
        var body = request.body;
        var authorization = request.get('Authorization');
        var authorized = await authenticate(db, authorization);

        if(authorized) {
            if(body.search) {
                db.registered.find({ [body.search.key] : body.search.value}, (err, data) => {
                    switch(body.search.type) {
                        case "json": {
                            response.status(200);
                            response.send(data);
                            return;
                        }
                        case "csv": {
                            jsonexport(data, function(err, csv) {
                                response.status(200);
                                response.send(csv);
                                return;
                            });
                        }
                        case undefined: {
                            response.status(400);
                            response.send();
                            return;
                        }
                    }
                });
            } else {
                db.registered.find({}, (err, data) => {
                    switch(body.search.type) {
                        case "json": {
                            response.status(200);
                            response.send(data);
                            return;
                        }
                        case "csv": {
                            jsonexport(data, function(err, csv) {
                                response.status(200);
                                response.send(csv);
                                return;
                            });
                        }
                        case undefined: {
                            response.status(400);
                            response.send();
                            return;
                        }
                    }
                });
            }
        } else {
            response.status(401);
            response.send(`This is not the endpoint you are looking for.`);
        };
    });

    app.put('/register', (request, response) => {
        var builder = creator(request.body);

        db.registered.find({"studentName": builder.studentName}, (err, data) => {
            if (data[0]) {
                db.registered.update({"studentName": builder.studentName}, {$set: builder}, (err, replaced) => {
                    response.status(200);
                    response.send(`Updated ${builder.studentName}'s information`);
                });
            } else {
                response.send(`No user was found, make sure you're using the right name`);
            }
        });
    });
};