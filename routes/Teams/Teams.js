const express = require('express');
const router = express.Router();

const TeamsController = require('./Teams.controller');

const authorization = require('../Middleware/authorization');

router.get('/findAll', authorization, TeamsController.findAll);

router.post('/create', authorization, TeamsController.create);

router.post('/members/add', authorization, TeamsController.addMember );

router.delete('/members/remove', authorization, TeamsController.removeMember);

router.post('/members/requests/accept', authorization, TeamsController.acceptRequest);

router.delete('/members/requests/deny', authorization, TeamsController.denyRequest);

module.exports = router;