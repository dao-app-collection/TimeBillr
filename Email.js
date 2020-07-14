const Email = require('email-templates');
const nodemailer = require('nodemailer');
const path = require('path');

const transport = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    secureConnection: false,
    port: 587,
    tls: {
        ciphers: 'SSLv3'
    },
    auth: {
        user: 'clintongillespie@outlook.com',
        pass: 'clintoncunt2'
    }
});

// const verificationEmail = (email, link) => {

//     const email = new Email({
//         message: {
//             from: 'TimeBillr'
//         },
//         transport: transport,
//     });

//     email.send({
//         template: 'verification/verification',,
//         message: {
//             to: email,
//         },
//         send: true,
//         locals: {
//             link: link,
//         }
//     }).then(res => {console.log(res).catch(err => {console.log(err)})})
// };

const verificationEmailRender = (emailAddress, link) => {
    console.log(emailAddress);
    const email = new Email({
        juice: true,
        juiceResources: {
            preserveImportant: true,
            webResources: {
                relativeTo: path.resolve('emails')
            }
        }
    });

    return email.render('verification/verification', {
        email: emailAddress,
        link: link,
    });
}

module.exports = { verificationEmailRender};