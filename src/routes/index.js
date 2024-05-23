// ////////
const middlewareAuth = require("../app/controllers/middlewareAuth");
const auth = require("./auth");
const user = require("./user");
const helper = require("./helper");
const admin = require("./admin");



function router(app) {
  app.use("/auth", auth);
  app.use("/user", user);
  app.use("/helper", helper);
  app.use("/admin", admin);


}

module.exports = router;
