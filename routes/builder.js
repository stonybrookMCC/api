function makeRegistered(data) {
    var info = {
        person: {
            name: {
                first: data.nameFirst.toLowerCase(),
                last: data.nameLast.toLowerCase()
            },
            parent: {
                first: data.parentFirst.toLowerCase(),
                last: data.parentLast.toLowerCase()
            },
            email: data.email,
            paid: false,
            session: data.session,
            regTime: new Date()
        }
    }

    return info;
}

function checkAuthorization(db, authorization) {
    return new Promise((resolve, reject) => {
        db.staff.find({}, (err, data) => {
            var authorized = [];
            var x;
            
            for(var i = 0; i < data.length; i++) {
                authorized.push(data[i].authorizeCode);
            }
            console.log(authorized + " authed")
            if(authorized.includes(authorization)) {
                resolve(true);
            } else {
                resolve(false);
            };
        });
    });
}

module.exports = { makeRegistered, checkAuthorization }