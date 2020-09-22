const moment = require('moment');
const db = require('../models/index');



async function queryForShiftReminder(){
    const startOfWeek = new Date(moment().startOf('week').utc().toString())

    const Rosters = await db.Roster.findAll({where: {weekStart: startOfWeek}, include: [
        {
            model: db.DaysShift,
            include: [
                {model: db.Shift,
                    include: [{
                        model: db.TeamMembership,
                        include: [
                            {
                                model: db.User,
                            }
                        ]
                    }]
                },
            ]
        }
    ]});

    return Rosters;
};

module.exports = queryForShiftReminder;