const express = require("express");
const router = express.Router();

const userController = require("../Controller/user");

// Register
router.post("/register", userController.register);

// Login
router.post("/login", userController.login);

module.exports = router;
