const { User, TeamMembership } = require("../../database/models/index");

module.exports = {
  getPermissionLevel: async (req, res, next) => {
    console.log(req.body);
    console.log(req.body.TeamId);
    console.log(req.userId);
    const teamMembership = await TeamMembership.findOne({
      where: { UserId: req.userId, TeamId: req.body.TeamId },
    });
    if (!teamMembership) {
      res.status(400).send({ error: "You are not a member of this Team" });
    }
    console.log(teamMembership.dataValues);
    console.log(teamMembership.dataValues.permissions);
    req.permissions = teamMembership.dataValues.permissions;
    next();
  },

  checkManager: async (req, res, next) => {
    const teamMembership = await TeamMembership.findOne({
      where: { UserId: req.userId, TeamId: req.body.TeamId },
    });
    if (!teamMembership) {
      res.status(400).send({ error: "You are not a member of this Team" });
    } else {
      teamMembership.dataValues.permissions === "manager"
        ? (req.permissions = "manager" && next())
        : res.status(400).send({
            error: "You need to be an manager to perform this action",
          });
    }
  },

  checkOwner: async (req, res, next) => {
    const teamMembership = await TeamMembership.findOne({
      where: { UserId: req.userId, TeamId: req.body.TeamId },
    });
    if (!teamMembership) {
      res.status(400).send({ error: "You are not a member of this Team" });
    } else {
      teamMembership.dataValues.permissions === "owner"
        ? (req.permissions = "owner" && next())
        : res
            .status(400)
            .send({ error: "You need to be an owner to perform this action" });
    }
  },

  checkOwnerOrManager: async (req, res, next) => {
    console.log(req.userId);
    console.log(req.body.TeamId);
    const teamMembership = await TeamMembership.findOne({
      where: { UserId: req.userId, TeamId: req.body.TeamId },
    });
    console.log(teamMembership);
    if (!teamMembership) {
      res.status(400).send({ error: "You are not a member of this Team" });
    } else {
      if (
        teamMembership.dataValues.permissions === "owner" ||
        teamMembership.dataValues.permissions === "manager"
      ) {
        req.permissions = teamMembership.dataValues.permissions;
        next();
      } else {
        res
          .status(400)
          .send({
            error: "You need to be an owner OR manager to perform this action",
          });
      }
    }
  },
};
