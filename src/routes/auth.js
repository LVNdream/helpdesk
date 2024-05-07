const express = require("express");
const router = express.Router();
const authController = require("../app/controllers/authController");
router.post("/checkid", authController.checkId);

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/getbackid", authController.getBackId);


module.exports = router;
