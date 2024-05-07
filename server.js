// cac thu vien
const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
const port = process.env.port;

const app = express();
//test database

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://192.168.1.3:3000",
    credentials: true,
  })
);

app.use((rq, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://192.168.1.3:3000");
  next();
});

const router = require("./src/routes/index");
router(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
