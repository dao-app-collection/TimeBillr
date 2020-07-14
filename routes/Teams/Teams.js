const express = require('express');
const router = express.Router();

const TeamsController = require('./Teams.controller');

const authorization = require('../Middleware/authorization')
const permissions = require('../Middleware/permissions');


router.get('/findAll', authorization, TeamsController.findAll);

router.get('/data/:id', authorization, TeamsController.getAllTeamData);

router.post('/create', authorization, TeamsController.create);

router.get('/invitation/:id', authorization, TeamsController.getRequest);

router.post('/invitation/:id', authorization, TeamsController.acceptRequest);

router.delete('/invitation/:id', authorization, TeamsController.denyRequest);

router.post('/members/add', authorization, permissions.getPermissionLevel, TeamsController.addMember );

router.delete('/members/remove', authorization, permissions.getPermissionLevel, TeamsController.removeMember);


module.exports = router;