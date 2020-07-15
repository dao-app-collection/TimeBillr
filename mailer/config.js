let nodemailer = require("nodemailer");

module.exports = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  secureConnection: false,
  port: 587,
  tls: {
    ciphers: "SSLv3",
  },
  auth: {
    user: "clintongillespie@outlook.com",
    pass: "clintoncunt2",
  },
});

// transporter.sendMail(mailOptions, (err, info) => {
//     if(err){
//         console.log(err);
//     } else {
//         console.log('Message sent: ', info.response);
//     }
// });
