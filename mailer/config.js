let nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
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

let mailOptions = {
    from: '"TimeBillr" <clintongillespie@outlook.com>',
    to: 'clintongillespie@outlook.com',
    subject: 'hello',
    text: 'Hello World',
    html: '<h1> Hello world! </h1>'
}

transporter.sendMail(mailOptions, (err, info) => {
    if(err){
        console.log(err);
    } else {
        console.log('Message sent: ', info.response);
    }
})