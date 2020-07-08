const express = require('express');
const router = express.Router();

const TeamsController = require('./Teams.controller');

const authorization = require('../Middleware/authorization');

router.get('/findAll', authorization, TeamsController.findAll);

router.post('/create', authorization, TeamsController.create);

module.exports = router;