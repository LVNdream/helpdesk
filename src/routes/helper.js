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
  middlewareAuth.verifyAuthentication,
  helperController.getRequestList
);



module.exports = router;
