const express = require("express");
const router = express.Router();

const TeamsController = require("./Teams.controller");
const TeamRolesController = require("./TeamRoles.controller");
const TeamRostersController = require("./TeamRosters.controller");

const authorization = require("../Middleware/authorization");
const permissions = require("../Middleware/permissions");
const { checkOwnerOrManager } = require("../Middleware/permissions");

router.get("/findAll", authorization, TeamsController.findAll);

router.get("/data/:id", authorization, TeamsController.getAllTeamData);

router.post("/create", authorization, TeamsController.create);

router.get("/invitation/:id", authorization, TeamsController.getRequest);

router.post("/invitation/:id", authorization, TeamsController.acceptRequest);

router.delete("/invitation/:id", authorization, TeamsController.denyRequest);

router.post(
  "/members/add",
  authorization,
  permissions.getPermissionLevel,
  TeamsController.addMember
);

router.delete(
  "/members/remove",
  authorization,
  permissions.getPermissionLevel,
  TeamsController.removeMember
);

router.put(
  "/members/edit",
  authorization,
  permissions.checkOwnerOrManager,
  TeamsController.membersEdit
);

// Roles routes

router.delete(
  "/roles",
  authorization,
  permissions.checkOwnerOrManager,
  TeamRolesController.delete
);

router.post(
  "/roles/create",
  authorization,
  permissions.checkOwnerOrManager,
  TeamRolesController.create
);

router.post(
  "/roles/addUser",
  authorization,
  permissions.checkOwnerOrManager,
  TeamRolesController.addUser
);

router.put(
  "/roles/edit",
  authorization,
  checkOwnerOrManager,
  TeamRolesController.update
);

// Initializes a new weekly roster, creating a empty roster with all 7 daysshifts linked to it(0 -6)
router.post(
  "/rosters/initialize",
  authorization,
  permissions.checkOwnerOrManager,
  TeamRostersController.initialize
);

router.get("/rosters/:teamId", authorization, TeamRostersController.getAll);

router.post('/rosters/:teamId/addShift', authorization, permissions.checkOwnerOrManager, TeamRostersController.addShifts);

module.exports = router;
