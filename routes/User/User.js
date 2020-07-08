const express = require('express');
const router = express.Router();

const UserController = require('./User.controller.js');

router.get('', UserController.all);

router.post('/login', UserController.logIn);

router.post('/register', UserController.register);

module.exports = router;