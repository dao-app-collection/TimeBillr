const db = require("../../database/models/index");
const mailer = require("../../mailer/config");
const mailOptions = require("../../mailer/mailOptions");

const moment = require('moment');

const { ErrorHandler } = require("../Middleware/ErrorHandler");
const { sequelize } = require("../../database/models/index");

const createDaysRosters = async (roster) => {
    startDate = moment(roster.dataValues.weekStart);
    console.log(startDate);
    const dates = [{day: 0, date: startDate.format("YYYY-MM-DD HH:mm:SS")}]
    for(let i = 1; i < 7; i++){
      dates.push({day: i, date: startDate.add(1, 'd').format("YYYY-MM-DD HH:mm:SS")})
    }

    console.log(dates);
    // const days = [0,1,2,3,4,5,6];
    // const weekStart = moment(roster.dataValues.weekStart);
    return Promise.all(dates.map(async date => {
        console.log('in the promise.all');
        console.log(date);
        return await db.DaysShift.create({RosterId: roster.dataValues.id, day: date.day, date: date.date})
    }))
};

const TeamRostersController = {
  async initialize(req, res, next) {
    const permissions = req.permissions;
    const TeamId = req.body.TeamId;
    const weekStart = req.body.weekStart;

    if (permissions === "owner" || permissions === "manager") {
      try {
          const result = await db.sequelize.transaction(async t => {

            console.log(weekStart);
            const startDate = moment(weekStart);
            console.log(startDate.format("YYYY-MM-DD HH:mm:SS"))

              const newRoster = await db.Roster.create({weekStart: weekStart, TeamId: TeamId});

              const newDaysRosters = await createDaysRosters(newRoster);

              return newRoster;
          });

          console.log(result);
          if(result){
              const returnRoster = await db.Roster.findOne({where: {id: result.dataValues.id},
            include: [{model: db.DaysShift}]});
              res.status(200).json(returnRoster);
          }
        // create the new roster for the startDate
        // create 7 new daysrosters and link each of them to the roster
      } catch (error) {
        throw new ErrorHandler(400, "Could not initialize new roster.");
      }
    }
  },

  async getAll(req, res, next) {
    console.log(req.params);
    const TeamId = req.params.teamId;

    try {
      const rosters = await db.Roster
      .findAll(
          { where: { TeamId: TeamId },
        include: [
            {
                model: db.DaysShift,
                include:[
                    {
                        model: db.Shift
                    }
                ]
            }, 
            
        ] });

      res.status(200).json(rosters);
    } catch (error) {
      console.log("------------an error from get all----------");
      console.log(error);
    }
  },
  async addShifts(req,res,next){
    const TeamId = req.params.teamId;
    const permissions = req.permissions;
    const shifts = req.body.shifts;
    const shiftsToDelete = req.body.shiftsToDelete;

    console.log(TeamId);
    console.log(permissions);
    console.log(shifts);
    console.log(shiftsToDelete);
    try {
      if (permissions === "owner" || permissions === "manager"){
        const result = await db.sequelize.transaction(async t => {
          return Promise.all([shifts.map(async shift => {
            return await db.Shift.create({
              start: shift.start,
              end: shift.end,
              TeamMembershipId: shift.TeamMembershipId,
              TeamRoleId: shift.TeamRoleId,
              DaysShiftId: shift.DaysShiftId,
            })
          })], [
            shiftsToDelete.map(async shift => {
              return await db.Shift.destroy({
                where:{id: shift.id}
              })
            }),
          ]);
        });
        if(result){
          res.status(200).send({success: 'Shifts saved successfully'})
        } else {
          throw new ErrorHandler(400, 'Could not save shifts - try again');
        }
      }else {
        throw new ErrorHandler(400, 'Permission denied - need to be an owner or manager');
      }
    } catch (error) {
      throw new ErrorHandler(400, 'Could not save shifts - try again');
    }  


  },

  async toggleComplete(req, res,next){
    const TeamId = req.params.teamId;
    const permissions = req.permissions;
    const roster = req.body.roster;
    console.log(roster);
    
    try {
      if (permissions === "owner" || permissions === "manager"){
        const result = await db.sequelize.transaction(async t => {
          const rosterToUpdate = await db.Roster.findOne({where: {id: roster.id}});
          console.log(rosterToUpdate.dataValues.complete ? false : true);
          console.log(rosterToUpdate.dataValues.complete === false);
          await rosterToUpdate.update({complete: rosterToUpdate.dataValues.complete ? false : true});
          await rosterToUpdate.save();
          return roster;
        })
        if(result){
          res.status(200).send({success: 'Roster Marked as Complete'});
        } else {
          throw new ErrorHandler(400, 'Could not complete roster');
        }
      } else {
        throw new ErrorHandler(400, 'Permission denied - need to be an owner or manager');
      }
    } catch (error) {
      throw new ErrorHandler(400, 'Could not complete roster');
    }
  }
};

module.exports = TeamRostersController;
