const middlewareAuth = require("../app/controllers/middlewareAuth");

const express = require("express");
const router = express.Router();
const adminController = require("../app/controllers/adminController");

var multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, res) => {
    res(null, "./src/public/temps");
  },
  filename: (req, file, res) => {
    res(
      null,
      Date.now() + Math.floor(Math.random() * 10000) + "-" + file.originalname
    );
  },
});
var upload = multer({ storage: storage });

router.get(
  "/getrequestlist",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.getRequestListAdmin
);
router.get(
  "/getrequestdetail/:id",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.getRequestDetail
);
router.post(
  "/getrequestlist/search",
  middlewareAuth.verifyAuthentication,
  adminController.getRequestListSearch
);
router.get(
  "/getlistuser",
  middlewareAuth.verifyAuthentication,
  adminController.getAlluser
);
router.post(
  "/getlistuser/search",
  middlewareAuth.verifyAuthentication,
  adminController.listUserBySearch
);

router.get(
  "/getuserinfor/:user_id",
  middlewareAuth.verifyAuthentication,
  adminController.adminGetUserById
);

router.post(
  "/updateuser/status",
  middlewareAuth.verifyAuthentication,
  adminController.updateUserStatus
);
router.post(
  "/deleteuser",
  middlewareAuth.verifyAuthentication,
  adminController.deleteUser
);

router.get(
  "/getlisthelper",
  middlewareAuth.verifyAuthentication,
  adminController.getAllHelper
);
router.post(
  "/getlisthelper/search",
  middlewareAuth.verifyAuthentication,
  adminController.listHelperBySearch
);

router.get(
  "/getlistcompany",
  middlewareAuth.verifyAuthentication,
  adminController.getAllCompany
);
router.post(
  "/getlistcompany/search",
  middlewareAuth.verifyAuthentication,
  adminController.listCompanyBySearch
);
router.post(
  "/register/helper",
  middlewareAuth.verifyAuthentication,
  adminController.registerHelper
);
router.get(
  "/getmaintenacetype",
  middlewareAuth.verifyAuthentication,
  adminController.getMaintenanceType
);

module.exports = router;
