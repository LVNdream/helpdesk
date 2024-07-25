const express = require("express");
const router = express.Router();
const authController = require("../app/controllers/authController");
const middlewareAuth = require("../app/controllers/middlewareAuth");

// there are router to auth controller

router.post("/checkid", authController.checkId);

router.post("/register", authController.register);

router.post("/login", middlewareAuth.verifyNormalUser, authController.login);

router.post(
  "/refreshtoken",
  middlewareAuth.verifyRefreshToken,
  authController.handleRefreshToken
);
router.post(
  "/loginadmin",
  middlewareAuth.verifyLoginAdmin,
  authController.loginAdmin
);
router.post("/getbackid", authController.getBackId);
router.post(
  "/verifypassword",
  middlewareAuth.verifyAuthentication,
  authController.verifyPassword
);
router.get(
  "/username",
  middlewareAuth.verifyAuthentication,
  authController.getUserName
);
router.post(
  "/update/pw",
  middlewareAuth.verifyAuthentication,
  authController.updatePassword
);

module.exports = router;
