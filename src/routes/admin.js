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
router.get(
  "/getrequestlist/search",
  middlewareAuth.verifyAuthentication,
  adminController.getRequestListSearch
);
router.get(
  "/getlistuser",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.getAlluser
);
router.get(
  "/getlistuser/search",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.listUserBySearch
);

router.get(
  "/getuserinfor/:user_id",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.adminGetUserById
);
router.get(
  "/gethelperinfor/:user_id",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.adminGethlperById
);
router.get(
  "/getuserinfor/accept/:user_id",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.adminGetUserByIdAccept
);
router.post(
  "/updateuser/status",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.updateUserStatus
);
router.post(
  "/updateuser/infor",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.AdminUpdateUserInfor
);
router.delete(
  "/deleteuser/:user_id",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.deleteUser
);

router.get(
  "/getlisthelper",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.getAllHelper
);
router.get(
  "/getlisthelper/search",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.listHelperBySearch
);

router.get(
  "/getlistcompany/addinfor",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.getAllCompanyToAddInfor
);
router.get(
  "/getlistcompany/addinfor/search",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.listCompanyBySearchToAddInfor
);
router.get(
  "/getlistcompany/watch",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.getAllCompanyToWatch
);
router.get(
  "/getlistcompany/watch/search",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.listCompanyBySearchToWatch
);
router.post(
  "/register/helper",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.registerHelper
);
router.get(
  "/getmaintenacetype",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.getMaintenanceType
);

router.post(
  "/updatehelper/infor",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.updateHelperInfor
);
router.post(
  "/checkcompanyname/",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.checkCompanyName
);

router.post(
  "/register/company",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.registerCompany
);

router.get(
  "/getcompanyinfor/:company_id",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.getCompanyInfor
);
router.post(
  "/updatecompany/infor",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.updateCompanyInfor
);

router.delete(
  "/deletecompany/:company_id",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.deleteCompany
);

router.get(
  "/getlistuser/waitaccept",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.getAlluserWaitAccept
);
router.get(
  "/getlistuser/waitaccept/search",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.listUserWaitAcceptBySearch
);

router.post(
  "/updateuser/status/normal",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.updateUserStatusNormal
);
router.post(
  "/updateuser/status/denied",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.updateUserStatusDenied
);
router.get(
  "/getmaintenance/class",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.adminGetMaintenanceType
);
router.post(
  "/update/namelabel",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.updateLabelName
);
router.post(
  "/add/namelabel",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.addNameLabel
);

//
router.get(
  "/getlistlabel/:maintenance_id",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.getListLabel
);
router.get(
  "/getlistlabel/:maintenance_id/search",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.listLabelBySearch
);
router.get(
  "/getlistmainclass/:maintenance_id",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.getMainClassById
);

router.post(
  "/addlabel-in-mainclass",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.addLabelInMainclass
);

router.get(
  "/getinforreport/",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.getInforReportCurrent
);
router.get(
  "/getinforreport/daily",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.getInforReportDaily
);
router.get(
  "/getinforreport/week",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.getInforReportWeek
);
router.get(
  "/getinforreport/month",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.getInforReportMonth
);
router.post(
  "/update/infor",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.updateAdminInfor
);
router.get(
  "/infor",
  middlewareAuth.verifyToKenAdminAuth,
  adminController.adminGetInfor
);

module.exports = router;
