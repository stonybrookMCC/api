const router = require('./router');

module.exports = function(app, db) {
    router(app, db);  
};