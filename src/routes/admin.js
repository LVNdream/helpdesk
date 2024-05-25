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
router.get(
  "/gethelperinfor/:user_id",
  middlewareAuth.verifyAuthentication,
  adminController.adminGethlperById
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
  "/getlistcompany/addinfor",
  middlewareAuth.verifyAuthentication,
  adminController.getAllCompanyToAddInfor
);
router.post(
  "/getlistcompany/addinfor/search",
  middlewareAuth.verifyAuthentication,
  adminController.listCompanyBySearchToAddInfor
);
router.get(
  "/getlistcompany/watch",
  middlewareAuth.verifyAuthentication,
  adminController.getAllCompanyToWatch
);
router.post(
  "/getlistcompany/watch/search",
  middlewareAuth.verifyAuthentication,
  adminController.listCompanyBySearchToWatch
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

router.post(
  "/updatehelper/infor",
  middlewareAuth.verifyAuthentication,
  adminController.updateHelperInfor
);
router.post(
  "/checkcompanyname/",
  middlewareAuth.verifyAuthentication,
  adminController.checkCompanyName
);

router.post(
  "/register/company",
  middlewareAuth.verifyAuthentication,
  adminController.registerCompany
);

router.get(
  "/getcompanyinfor/:company_id",
  middlewareAuth.verifyAuthentication,
  adminController.getCompanyInfor
);
router.post(
  "/updatecompany/infor",
  middlewareAuth.verifyAuthentication,
  adminController.updateCompanyInfor
);

router.post(
  "/deletecompany",
  middlewareAuth.verifyAuthentication,
  adminController.deleteCompany
);

router.get(
  "/getlistuser/waitaccept",
  middlewareAuth.verifyAuthentication,
  adminController.getAlluserWaitAccept
);
router.post(
  "/getlistuser/waitaccept/search",
  middlewareAuth.verifyAuthentication,
  adminController.listUserWaitAcceptBySearch
);

router.post(
  "/updateuser/status/normal",
  middlewareAuth.verifyAuthentication,
  adminController.updateUserStatusNormal
);
router.post(
  "/updateuser/status/denied",
  middlewareAuth.verifyAuthentication,
  adminController.updateUserStatusDenied
);
router.get(
  "/getmaintenance/class",
  middlewareAuth.verifyAuthentication,
  adminController.adminGetMaintenanceType
);
router.post(
  "/update/namelabel",
  middlewareAuth.verifyAuthentication,
  adminController.updateLabelName
);
router.post(
  "/add/namelabel",
  middlewareAuth.verifyAuthentication,
  adminController.addNameLabel
);

//
router.get(
  "/getlistlabel",
  middlewareAuth.verifyAuthentication,
  adminController.getListLabel
);
router.post(
  "/getlistlabel/search",
  middlewareAuth.verifyAuthentication,
  adminController.listLabelBySearch
);
router.post(
  "/getlistmainclass",
  middlewareAuth.verifyAuthentication,
  adminController.getMainClassById
);

router.post(
  "/addlabel-in-mainclass",
  middlewareAuth.verifyAuthentication,
  adminController.addLabelInMainclass
);
router.get(
  "/getinforreport",
  middlewareAuth.verifyAuthentication,
  adminController.getInforReport
);

module.exports = router;
