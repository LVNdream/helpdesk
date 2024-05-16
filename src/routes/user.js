const middlewareAuth = require("../app/controllers/middlewareAuth");

const express = require("express");
const router = express.Router();
const userController = require("../app/controllers/userController");

var multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, res) => {
    res(null, "./src/public/temps");
  },
  filename: (req, file, res) => {
    res(null, Date.now() +Math.floor(Math.random() * 10000)+ "-" + file.originalname);
  },
});
var upload = multer({ storage: storage }); 



router.get(
  "/getrequestlist",
  middlewareAuth.verifyAuthentication,
  userController.getRequestList
);
router.get(
  "/getrequestdetail/:id",
  middlewareAuth.verifyAuthentication,
  userController.getRequestDetail
);
router.post(
  "/update/userinfor",
  middlewareAuth.verifyAuthentication,
  userController.updateUserInfor
);

router.get(
  "/register-request",
  middlewareAuth.verifyAuthentication,
  userController.getRegisterRequest
);
router.post(
  "/register-request",
  middlewareAuth.verifyAuthentication,
  upload.any(),
  userController.userRegisterRequest
);

module.exports = router;
