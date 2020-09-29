const db = require("../../database/models/index");
const mailer = require("../../mailer/config");
const mailOptions = require("../../mailer/mailOptions");

const { ErrorHandler } = require("../Middleware/ErrorHandler");
const { sequelize } = require("../../database/models/index");

module.exports = {
  // this returns the users TeamMembership, this is to decide
  // Whether the 'admin' part of the app, or general employee
  // part of the app will be shown.
  async user(req,res,next){
    console.log(req.params);
    console.log(req.params.id);
    console.log(req.userId);

    try {
      const result= await db.sequelize.transaction(async t => {
        const teamMembership = await db.TeamMembership
        .findOne({where: {TeamId: req.params.id, UserId: req.userId},
           include: [
            {
              model: db.Unavailable
            },
            {
              model: db.Holidays
            }
          ]});
        console.log(teamMembership)
          return teamMembership;
      });
      if(result){
        console.log('------Team Membership Found ------')
        console.log(result);
        res.status(200).json(result);
      } else {
        console.log(result);
        throw new ErrorHandler(400, 'Could not find TeamMembership');
      }
    } catch (error) {
      console.log(error);
      throw new ErrorHandler(400, 'Could not find TeamMembership');
    }
  },
  // returns all organizations that one user is a member of
  async findAll(req, res) {
    console.log("in Find All");
    console.log(req.userId);

    try {
      const result = await db.sequelize.transaction(async (t) => {
        memberships = await db.TeamMembership.findAll({
          where: { UserId: req.userId },
        });
        console.log(memberships);
        let teams;
        if (memberships.length > 0) {
          teams = await Promise.all(
            memberships.map(async (membership) => {
              return membership.getTeam();
            })
          );
        } else if (memberships) {
          teams = await memberships.getTeam();
        } else {
          return [];
        }
        console.log(teams);
        return teams;
      });
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
    }
  },
  async getAllTeamData(req, res, next) {
    console.log('------------Get All Team Data--------')
    console.log(req.params);
    try {
      let team = await db.Team.findOne({
        where: {
          id: req.params.id,
        },
        include: [
          {
            model: db.TeamMembership,
            // attributes: ['id, UserId, TeamId, permissions, employmentType'],
            include: [
              {
                model: db.User,
              },
              {
                model: db.EmployeeRole,
              },
            ],
          },
          {
            model: db.Holidays,
          },
          {
            model: db.TeamMembershipRequest,
          },
          {
            model: db.TeamRoles,
            include: [
              {
                model: db.EmployeeRole,
                include: [
                  {
                    model: db.TeamMembership,
                    include: [
                      {
                        model: db.User,
                      },
                      {
                        model: db.Unavailable,
                      },
                      {
                        model: db.Holidays,
                      }
                    ],
                  },
                ],
              },
            ],
          },
          {
            model: db.TeamSettings,
            include: [
              {
                model: db.OpeningHours
              }
            ]
          },
        ],
      });
      if (!team) {
        throw new ErrorHandler(400, "Team not found");
      }
      res.status(200).json(team);
    } catch (error) {
      next(error);
    }
  },
  // creates a new organization, with the creator as a Member with permissions Owner
  // currently untested
  async create(req, res) {
    const { name, description } = req.body;

    try {
      console.log(req.userId);
      const result = await db.sequelize.transaction(async (t) => {
        let newTeam = await db.Team.create({
          name: name,
          description: description,
        });
        console.log(newTeam.dataValues.id);

        let newMembership = await db.TeamMembership.create({
          permissions: "owner",
          TeamId: newTeam.dataValues.id,
          UserId: req.userId,
          employmentType: "full-time",
        });
        let defaultSettings = await db.TeamSettings.create({shiftReminders:true, TeamId: newTeam.dataValues.id});

        let days = [0, 1, 2, 3, 4, 5, 6];

        let defaultOpeningHours = await Promise.all(days.map(async day => {
          return db.OpeningHours.create({day: day, open: 32400000,close: 32400000, TeamSettingId: defaultSettings.dataValues.id});
        }))
        console.log(newMembership);
        return newTeam;
      });
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
    }
  },
  // Middleware passes to this route, the permissions of the sender for this team on req.permissions
  // Creates a member of the organization with permissions = req.data.permissions
  // Only an owner / manager can add a member
  // An owner can create a manager or a member,
  // A manager can create a member or a manager
  // An email is sent with the request to join the team
  async addMember(req, res) {
    console.log(req.body);
    const {TeamId} = req.body;
    if (req.permissions !== "employee") {
      try {
        const result = await db.sequelize.transaction(async (t) => {
          let team = await db.Team.findOne({ where: { id: TeamId } });
          let newMembershipRequest = await db.TeamMembershipRequest.create({
            email: req.body.email,
            permissions: req.body.permissions,
            TeamId: TeamId,
            employmentType: req.body.employmentType,
          });
          mailer.sendMail(
            mailOptions.createTeamInviteEmailOptions(
              req.body.email,
              team.dataValues.name,
              newMembershipRequest.dataValues.id
            ),
            (err, info) => {
              if (err) {
                console.log(err);
              } else {
                console.log(info.response);
              }
            }
          );
          return newMembershipRequest;
        });
        res
          .status(200)
          .send({ success: `Invitation sent to ${req.body.email}` });
      } catch (error) {
        console.log(error);
        res.status(400).send({ error: error });
      }
    } else {
      res.status(400).send({
        error:
          "You can not add a new member if you are only a member of the team. You need higher permissions.",
      });
    }
  },
  // Removes a member of the organization
  // each role can only delete a member roles below them
  // Associated records remain
  async removeMember(req, res, next) {},

  async membersEdit(req, res, next) {
    const permissions = req.permissions;
    const { employee, values, TeamId} = req.body;
    console.log(permissions);
    console.log("------this is the member-----");
    console.log(req.body);
    if (permissions === "owner" || permissions === "manager") {
      console.log("can update");
      try {
        const update = await db.sequelize.transaction(async (t) => {
          let user = await db.TeamMembership.findOne({
            where: { UserId: employee.id, TeamId: parseInt(TeamId) },
          });
          user.minimumHours = values.minimumHours ? values.minimumHours : 0;
          user.permissions = values.permissions.toLowerCase();
          user.employmentType = values.employmentType;

          await user.save();

          return user;
        });

        res.status(200).send({
          success: `Updated user: ${employee.User.firstName} ${employee.User.lastName}`,
        });
      } catch (error) {
        console.log("-------new error----");
        console.log(error);
        throw new ErrorHandler(
          400,
          `Unable to update user: ${employee.User.firstName} ${employee.User.lastName}`
        );
      }
    }
  },
  async updateSettings(req,res,next){
    const {TeamId, openingTimes, reminders} = req.body;
    console.log(openingTimes);
    console.log(reminders);

    try {
      let teamSettings = await db.TeamSettings.findOne({where: {TeamId: TeamId}});
      if(!teamSettings){
        teamSettings = await db.TeamSettings.create({shiftReminders: reminders, TeamId: TeamId})
      }
      const result = await db.sequelize.transaction(async t => {
        console.log(teamSettings);
        teamSettings.shiftReminders = reminders;
        await teamSettings.save();
        const openings = await db.OpeningHours.findAll({where: {TeamSettingId: teamSettings.dataValues.id}});

        const deleted = await Promise.all(openings.map(async opening => {
          return opening.destroy();
        }));
        let newOpenings = [];
        for(let i = 0; i < 7; i++){
          console.log(openingTimes[i]);
          let newOpening = await db.OpeningHours.create({TeamSettingId: teamSettings.dataValues.id, open: openingTimes[i].open, close: openingTimes[i].close, day: i});
          newOpenings.push(newOpening);
        };
        return newOpenings;
      })
      if(result){
        res.status(200).send({message: 'Settings Updated'});
      }
    } catch (error) {
      console.log(error);
      throw new ErrorHandler(400, 'Could not update settings')
    }
    
  },
  // Sends information on a memmbership request,
  // This route is hit when a membership email request is sent,
  // When the inivitation accept/deny page is loaded,
  // A request will be sent here to retrieve the information on the membership request
  async getRequest(req, res, next) {
    try {
      const membershipRequest = await db.TeamMembershipRequest.findOne({
        where: { id: req.params.id },
      });
      if (!membershipRequest) {
        throw new ErrorHandler(400, "Membership Request doesnt exist");
      }
      console.log(membershipRequest);
      const team = await db.Team.findOne({
        where: { id: membershipRequest.dataValues.TeamId },
      });
      console.log(team);
      const data = {
        email: membershipRequest.dataValues.email,
        teamName: team.dataValues.name,
        description: team.dataValues.description,
      };
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  // When a user accepts a request to join a team,
  // this route is pinged, a new membership is created from the membership request
  async acceptRequest(req, res, next) {
    try {
      const result = db.sequelize.transaction(async (t) => {
        const membershipRequest = await db.TeamMembershipRequest.findOne({
          where: { id: req.params.id },
        });
        if (!membershipRequest) {
          throw new ErrorHandler(
            400,
            "Could not find membership request, may have already been accepted/denyed"
          );
        }
        const newMembership = await db.TeamMembership.create({
          permissions: membershipRequest.dataValues.permissions,
          TeamId: membershipRequest.dataValues.TeamId,
          UserId: req.userId,
          employmentType: membershipRequest.dataValues.employmentType,
        });
        if (!newMembership) {
          throw new ErrorHandler(400, "Could not create a new membership");
        }
        await membershipRequest.destroy();

        return newMembership;
      });
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  },
  // When a user denys a request to join a team,
  // this route is pinged, the membership request is deleted.
  async denyRequest(req, res, next) {
    try {
      const result = db.sequelize.transaction(async (t) => {
        const membershipRequest = await db.TeamMembershipRequest.findOne({
          where: { id: req.params.id },
        });
        if (!membershipRequest) {
          throw new ErrorHandler(
            400,
            "Could not find membership request, may have already been accepted/denyed"
          );
        }
        return await membershipRequest.destroy();
      });
      res.status(200);
    } catch (error) {
      next(error);
    }
  },

  async handleHolidayRequest(req, res, next){
    const {HolidayId, param} = req.body;
    let message = null;

    try {
      const result = db.sequelize.transaction(async t => {
        const holiday = await db.Holidays.findOne({
          where: {id: HolidayId}
        });
        if(param === 'approve'){
          holiday.approved = true;
          holiday.save()
          message = 'approved';
        } else if (param === 'deny'){
          holiday.denied = true;
          holiday.save();
          message = 'denied';
        } else {
          holiday.destroy();
          message = 'deleted';
        }
        return holiday;
      });
      console.log(result);
      if(result){
        res.status(200).send({success: `Holiday request has been ${message}`});
      } else {
        throw new ErrorHandler(400, 'Could not handle holiday request');
      }
    } catch (error) {
      throw new ErrorHandler(400, 'Could not handle holiday request');
    }
  }
};
