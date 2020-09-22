const cron = require('node-cron');
const mailer = require('./mailer/config');
const mailOptions = require('./mailer/mailOptions');
const moment = require('moment');

// moment.locale('de');
const startOfWeek = moment().startOf('week').valueOf();

console.log(startOfWeek);


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