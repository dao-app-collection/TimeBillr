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
};

module.exports = TeamRostersController;
