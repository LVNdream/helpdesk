// ////////
const middlewareAuth = require("../app/controllers/middlewareAuth");
const auth = require("./auth");
const user = require("./user");
const helper = require("./helper");
const admin = require("./admin");

// config router
function router(app) {
  app.use("/auth", auth); // router to auth
  app.use("/user", user); // router to user
  app.use("/helper", helper); // router to helper
  app.use("/admin", admin); // router to admin
}

module.exports = router;
