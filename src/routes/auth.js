const express = require("express");
const router = express.Router();
const authController = require("../app/controllers/authController");
const middlewareAuth = require("../app/controllers/middlewareAuth");
router.post("/checkid", authController.checkId);

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post(
  "/loginadmin",
  middlewareAuth.verifyLoginAdmin,
  authController.login
);
router.post("/getbackid", authController.getBackId);
router.post("/verifypassword",middlewareAuth.verifyAuthentication, authController.verifyPassword);

module.exports = router;
