const middlewareAuth = require("../app/controllers/middlewareAuth");

const express = require("express");
const router = express.Router();
const helperController = require("../app/controllers/helperController");

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
  middlewareAuth.verifyToKenHelperAuth,
  helperController.getRequestList
);
router.get(
  "/getrequestlist/search",
  middlewareAuth.verifyToKenHelperAuth,
  helperController.getRequestListSearch
);
router.post(
  "/acceptrequest",
  middlewareAuth.verifyToKenHelperAuth,
  helperController.acceptRequest
);

// thay doi trang thai
router.get(
  "/savestatus-processing/:request_id",
  middlewareAuth.verifyToKenHelperAuth,
  helperController.saveStatusProcessing
);
// cap nhat problem
router.post(
  "/addproblems",
  middlewareAuth.verifyToKenHelperAuth,
  helperController.addProblems
);
router.post(
  "/updateproblem",
  middlewareAuth.verifyToKenHelperAuth,
  helperController.updateProblem
);
router.post(
  "/deleteproblem",
  middlewareAuth.verifyToKenHelperAuth,
  helperController.deleteProblem
);

// getAllFile
router.get(
  "/getfiles/:request_id",
  middlewareAuth.verifyToKenHelperAuth,
  helperController.getFiles
);

router.post(
  "/verifycompleted",
  middlewareAuth.verifyToKenHelperAuth,
  helperController.verifyCompleted
);
router.get(
  "/getinforcompleted/:request_id",
  middlewareAuth.verifyToKenHelperAuth,
  helperController.getInforComplted
);
router.get(
  "/getalluser",
  middlewareAuth.verifyToKenHelperAuth,
  helperController.getAllUser
);

router.post(
  "/registerrequest/completed",
  middlewareAuth.verifyToKenHelperAuth,
  upload.any(),
  helperController.addRequestComplete
);

module.exports = router;
