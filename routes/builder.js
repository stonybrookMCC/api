const nodemailer = require('nodemailer');
const config = require('../config');
const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox',
    'client_id': config.paypal.client_id,
    'client_secret': config.paypal.client_secret
});

function makeRegistered(data) {
    var info = {
        studentName: data.studentName.toLowerCase(),
        studentGrade: data.studentGrade,
        parentName: data.parentName.toLowerCase(),
        parentEmail: data.parentEmail,
        parentNumber: data.parentNumber,
        session: data.session,
        paymentID: data.paymentID,
        registerTime: new Date()
    }
    return info;
};

function checkAuthorization(db, authorization) {
    return new Promise((resolve, reject) => {
        db.staff.find({}, (err, data) => {
            var authorized = [];
            
            for(var i = 0; i < data.length; i++) {
                authorized.push(data[i].authorizeCode);
            }
            
            if(authorized.includes(authorization)) {
                resolve(true);
            } else {
                reject(false);
            };
        });
    });
};

// function sendEmail(db, builder) {
//     var transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: config.email.user,
//             pass: config.email.pass
//         }
//     });
    
//     var mailOptions = {
//         from: config.email.user,
//         to: builder.person.parent.email,
//         subject: 'Registered your child for MCC',
//         text: `Hey there ${builder.person.parent.first}, you just registered your child for the Stony Brook Minecraft club!`
//     };
    
//     transporter.sendMail(mailOptions, function(error, info){
//         if (error) {
//             console.log(error);
//         } else {
//             console.log('Email sent: ' + info.response);
//         };
//     });
// };

function sendInvoice(data) {
    var name = data.parentName.split(" ");
    var invoice = {
        "merchant_info": config.paypal.merchant_info,
        "billing_info": [{
            "email": data.parentEmail,
            "first_name": name[0],
            "last_name": name[1]
        }],
        "items": [{
            "name": "Minecraft Club Session",
            "quantity": 1,
            "unit_price": {
                "currency": "USD",
                "value": "30"
            }
        }],
        "note": "Express check out was closed, so here's an invoice.",
        "terms": "No refunds after 30 days."
    }
    paypal.invoice.create(invoice, function(error, _invoice) {
        if (error) {
            throw error;
        } else {
            console.log(`Created an invoice for ${data.parentName}`);
            paypal.invoice.send(_invoice.id, function (error, response) {
                if (error) {
                    throw error;
                } else {
                    console.log(`Sent invoice for ${data.parentName}`);
                }
            });
        }
    });
};

module.exports = { makeRegistered, checkAuthorization, sendInvoice };