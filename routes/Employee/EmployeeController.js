const db = require("../../database/models/index");
const mailer = require("../../mailer/config");
const mailOptions = require("../../mailer/mailOptions");

const moment = require("moment");

const { ErrorHandler } = require("../Middleware/ErrorHandler");
const { sequelize } = require("../../database/models/index");


const EmployeeController = {
    async getAllEmployeeShifts(req, res, next){
        const TeamId = req.params.teamId;
        const TeamMembershipId = req.params.teamMembershipId;
        console.log(req.params);
        console.log('in /teamId/employeeId');

        const rosters = await db.Roster.findAll({
            where: { TeamId: TeamId },
            include: [
              {
                model: db.DaysShift,
                include: [
                  {
                    model: db.Shift,
                    where: {TeamMembershipId: TeamMembershipId}
                  },
                ],
              },
            ],
          });

          if(rosters){
              res.status(200).json(rosters);
          } else {
              throw new ErrorHandler(400, 'Could not find rosters')
          }
    },

    async confirmShift(req,res,next){
        const {ShiftId, TeamId} =req.body;
        console.log(req.body);

        try {
            const result = await db.sequelize.transaction(async t => {
                const shift = await db.Shift.findOne({where: {id: ShiftId}});
                shift.confirmed = true;
                await shift.save()
                return shift;
            })
            console.log(result);
            if(result){
                res.status(200).send({success: 'Shift Confirmed'});
            }else {
                throw new ErrorHandler(400, 'Could not confirm shift');
            }
        } catch (error) {
            throw new ErrorHandler(400, 'Could not confirm shift');
        }
    },
    async changeAvailabilities(req,res,next){
        console.log(req.body);
        const TeamMembershipId = req.params.teamMembershipId;
        const {TeamId} = req.body;
        const {Sunday, Sundayend, Monday, Mondayend, Tuesday, Tuesdayend,
            Wednesday, Wednesdayend, Thursday, Thursdayend, Friday, Fridayend, Saturday, Saturdayend
        } = req.body.availabilities;

        console.log(Sunday);

        try {
            const result = await sequelize.transaction(async t => {
                // find all existing availabilities
                const existingAvailabilities = await db.Unavailable.findAll({
                    where: {TeamMembershipId: TeamMembershipId}
                });
                // remove all existing availabilities.
                const deleted = await Promise.all(existingAvailabilities.map( async existing => {
                    return await existing.destroy();
                }));
                if(Sunday){
                    const sunday = await db.Unavailable.create({
                        day: 0,
                        start: Sunday,
                        end: Sundayend,
                        TeamId: TeamId,
                        TeamMembershipId: TeamMembershipId,
                    })
                }
                if(Monday){
                    const monday = await db.Unavailable.create({
                        day: 1,
                        start: Monday,
                        end: Mondayend,
                        TeamId: TeamId,
                        TeamMembershipId: TeamMembershipId,
                    })
                }
                if(Tuesday){
                    const tuesday = await db.Unavailable.create({
                        day: 2,
                        start: Tuesday,
                        end: Tuesdayend,
                        TeamId: TeamId,
                        TeamMembershipId: TeamMembershipId,
                    })
                }
                if(Wednesday){
                    const wednesday = await db.Unavailable.create({
                        day: 3,
                        start: Wednesday,
                        end: Wednesdayend,
                        TeamId: TeamId,
                        TeamMembershipId: TeamMembershipId,
                    })
                }
                if(Thursday){
                    const thursday = await db.Unavailable.create({
                        day: 4,
                        start: Thursday,
                        end: Thursdayend,
                        TeamId: TeamId,
                        TeamMembershipId: TeamMembershipId,
                    })
                }
                if(Friday){
                    const friday = await db.Unavailable.create({
                        day: 5,
                        start: Friday,
                        end: Fridayend,
                        TeamId: TeamId,
                        TeamMembershipId: TeamMembershipId,
                    })
                }
                if(Saturday){
                    const saturday = await db.Unavailable.create({
                        day: 6,
                        start: Saturday,
                        end: Saturdayend,
                        TeamId: TeamId,
                        TeamMembershipId: TeamMembershipId,
                    })
                };
                res.status(200).send({success: 'Availabilities updated'});
            })
            
        } catch (error) {
            console.log(error);
            throw new ErrorHandler(400, 'Could not update availabilities, ensure if you fill out a day, that the day end is filled. :)')
        }
        console.log(req.params);

        console.log(TeamMembershipId);
    },
    async requestHoliday(req,res,next){
        const TeamMembershipId = req.params.teamMembershipId;
        const {TeamId, start, end} = req.body;

        console.log(start);
        console.log(end);

        try {
            const holidayRequest = await db.Holidays.create({
                TeamId: TeamId,
                TeamMembershipId: TeamMembershipId,
                start: start,
                end: end,
            });

            if(holidayRequest){
                res.status(200).send({success: 'Holiday request sent, this will be approved by your employer and accepted/denied'});
            }
        } catch (error) {
            throw new ErrorHandler(400, 'Could not submit Holiday Request, please try again.');
        }
    }
};

module.exports = EmployeeController;