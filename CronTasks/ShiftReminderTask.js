const mailer = require('../mailer/config');
const mailOptions = require('../mailer/mailOptions');
const queryForShiftReminder = require('../database/queries/queryForShiftReminder');

async function sendShiftReminderEmail(email){
    let options = await mailOptions.createShiftReminderEmail(email);
    
    // console.log(options);
    mailer.sendMail(options, (err, info) => {
                if(err){
                    console.log(err);
                } else {
                    console.log(info)
                }
            });
};

async function ShiftReminderTask(){
    let Rosters = await queryForShiftReminder();

    Rosters.forEach(roster => {
        // users will contain duplicate values of users
        // if the user has more than one shift
        // the mail service, outlook, has a limit of 3 emails being sent at a time,
        // so we create a counter, and set a timeout for each email, so one email gets sent, 
        // 1 second waits, then another email is sent.
        let counter = 1;
        let users = [];

        roster.DaysShifts.forEach(daysshift => {
            // console.log(daysshift);
            daysshift.Shifts.forEach(shift => {
                // console.log(shift);
                users.push(shift.TeamMembership.User.dataValues);

            })
        })
        users = users.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i);
        users.forEach(user => {
            // console.log(user.email);
            setTimeout(() => {
                sendShiftReminderEmail(user.email);
            }, counter * 1000);

            counter ++;
            
        })
        // console.log(users);
    });
    
};

module.exports = ShiftReminderTask;
