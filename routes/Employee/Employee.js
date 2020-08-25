const express = require("express");
const router = express.Router();

const authorization = require("../Middleware/authorization");
const permissions = require("../Middleware/permissions");

const EmployeeController = require('./EmployeeController');

router.get('/:teamId/:teamMembershipId', authorization, EmployeeController.getAllEmployeeShifts);

router.post('/shift/confirm',authorization, EmployeeController.confirmShift);

router.post('/changeAvailabilities/:teamMembershipId', authorization, EmployeeController.changeAvailabilities);
module.exports = router;
