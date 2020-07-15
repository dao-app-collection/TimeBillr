const express = require("express");
const router = express.Router();

const UserController = require("./User.controller.js");
const authorization = require("../Middleware/authorization.js");

// the authorization middleware will pass the userId through req.userId

router.get("", authorization, UserController.all);

router.post("/login", UserController.logIn);

router.post("/register", UserController.register);

router.post("/logout", authorization, UserController.logOut);

router.get("/checkToken", authorization, UserController.checkToken);

router.post("/emailVerification", UserController.verifyEmail);

module.exports = router;
