const cron = require('node-cron');
const mailer = require('./mailer/config');
const mailOptions = require('./mailer/mailOptions');
const moment = require('moment-timezone');

moment.locale('de');
const startOfWeek = moment().tz('Australia/Sydney').startOf('week');

console.log(startOfWeek.format('YYYY/MM/DD HH:mm:SS'));


cron.schedule('* * * * *', async () => {

    
    mailer.sendMail(await mailOptions.createShiftReminderEmail('clintongillespie@outlook.com'), (err, info) => {
        if(err){
            console.log(err);
        } else {
            console.log(info)
        }
    })
});

// cron.schedule('* * * * *', () => {
//     console.log('running a task every minute')
// });