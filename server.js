// cac thu vien
const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
const port = process.env.port;
const schedule = require("node-schedule");
const cron = require("node-cron");

const app = express();
//test database

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  express.text({
    extended: true,
  })
);
// /////////Static file
app.use(express.static(path.join(__dirname, "src/public")));

// /////////
app.use(bodyParser.json());
// app.use(
//   cors({
//     origin: "http://192.168.1.3:3000",
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: "http://172.16.0.2:3000",
    credentials: true,
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://172.16.0.2:3000");
  next();
});

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", ["http://192.168.1.3:3000"]);
//   next();
// });

const router = require("./src/routes/index");
const midService = require("./src/app/services/midService");
router(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// const job = schedule.scheduleJob("* * * * * 7", function () {
//   console.log("The answer to life, the universe, and everything!");
// });
cron.schedule("* * 0 * * 7", () => {
  console.log("Start delete");
  const resultDelete = midService.removeAllfile("./src/public/temps");
});
/////// Len lich chayj ham
