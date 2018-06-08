const nodemailer = require('nodemailer');
const config = require('../config');

function makeRegistered(data) {
    var info = {
        person: {
            name: {
                first: data.nameFirst.toLowerCase(),
                last: data.nameLast.toLowerCase()
            },
            parent: {
                first: data.parentFirst.toLowerCase(),
                last: data.parentLast.toLowerCase(),
                email: data.email
            },
            paid: false,
            session: data.session,
            regTime: new Date()
        }
    }
    return info;
};

function checkAuthorization(db, authorization) {
    return new Promise((resolve, reject) => {
        db.staff.find({}, (err, data) => {
            var authorized = [];
            var x;
            
            for(var i = 0; i < data.length; i++) {
                authorized.push(data[i].authorizeCode);
            }
            
            if(authorized.includes(authorization)) {
                resolve(true);
            } else {
                resolve(false);
            };
        });
    });
};

function sendEmail(db, builder) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.email.user,
            pass: config.email.pass
        }
    });
    
    var mailOptions = {
        from: config.email.user,
        to: builder.person.parent.email,
        subject: 'Registered your child for MCC',
        text: `Hey there ${builder.person.parent.first}, you just registered your child for the Stony Brook Minecraft club!`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        };
    });
};

module.exports = { makeRegistered, checkAuthorization, sendEmail }