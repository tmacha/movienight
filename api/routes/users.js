const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/createOrUpdate", userController.createOrUpdateUser);

module.exports = router;
