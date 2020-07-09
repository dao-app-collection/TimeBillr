const express = require('express');
const router = express.Router();

const UserController = require('./User.controller.js');
const authorization = require('../Middleware/authorization.js');

router.get('', UserController.all);

router.post('/login', UserController.logIn);

router.post('/register', UserController.register);

router.get('/checkToken', authorization, UserController.checkToken);

router.post('/emailVerification', UserController.verifyEmail);

module.exports = router;