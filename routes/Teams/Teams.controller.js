const db = require("../../database/models/index");
const mailer = require("../../mailer/config");
const mailOptions = require("../../mailer/mailOptions");

const { ErrorHandler } = require("../Middleware/ErrorHandler");
const { sequelize } = require("../../database/models/index");

module.exports = {
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
    try {
      let team = await db.Team.findOne({
        where: {
          id: req.params.id,
        },
        include: [
          {
            model: db.TeamMembership,
            // attributes: ['id, UserId, TeamId, permissions, employmentType'],
            include:[{
              model: db.User,
            }, {
              model: db.EmployeeRole,
            }]
          },
          {
            model: db.TeamMembershipRequest,
          },
          {
            model: db.TeamRoles,
            include: [
              {
                model: db.EmployeeRole,
                include: [{
                  model: db.TeamMembership,
                  include:[{
                    model: db.User
                  }]
                }]
              }
            ]
          }, 
          {
            model: db.TeamSettings,
          }
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
  async create(req, res) {
    const { name, description } = req.body;

    try {
      console.log(req.userId);
      const result = await db.sequelize.transaction(async (t) => {
        newTeam = await db.Team.create({
          name: name,
          description: description,
        });
        console.log(newTeam.dataValues.id);

        newMembership = await db.TeamMembership.create({
          permissions: "owner",
          TeamId: newTeam.dataValues.id,
          UserId: req.userId,
          employmentType: 'full-time'
        });
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
    if (req.permissions !== "employee") {
      try {
        const result = await db.sequelize.transaction(async (t) => {
          let team = await db.Team.findOne({ where: { id: req.body.teamId } });
          let newMembershipRequest = await db.TeamMembershipRequest.create({
            email: req.body.email,
            permissions: req.body.permissions,
            TeamId: req.body.teamId,
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
      res
        .status(400)
        .send({
          error:
            "You can not add a new member if you are only a member of the team. You need higher permissions.",
        });
    }
  },
  // Removes a member of the organization
  // each role can only delete a member roles below them
  // Associated records remain
  async removeMember(req, res, next) {},

  async membersEdit(req, res, next){
    const permissions = req.permissions;
    const {employee, values, TeamId} = req.body;
    console.log(permissions)
    console.log('------this is the member-----')
    console.log(req.body);
    if(permissions === 'owner' || permissions === 'manager'){
      console.log('can update');
      try {
        const update = await db.sequelize.transaction(async t => {
          let user = await db.TeamMembership.findOne({where: {UserId: employee.id, TeamId: parseInt(TeamId)}});
          user.permissions = values.permissions.toLowerCase();
          user.employmentType =values.employmentType;
  
          await user.save();
  
          return user;
        });

        res.status(200).send({success: `Updated user: ${employee.User.firstName} ${employee.User.lastName}`})
      } catch (error) {
        console.log('-------new error----');
        console.log(error);
        throw new ErrorHandler(400, `Unable to update user: ${employee.User.firstName} ${employee.User.lastName}`);
      }
      
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
};
