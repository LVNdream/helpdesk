const express = require("express");
const router = express.Router();
const userController = require("../app/controllers/userController");
router.post("/getrequestlist", userController.getRequestList);


module.exports = router;
