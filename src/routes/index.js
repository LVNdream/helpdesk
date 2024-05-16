// ////////
const middlewareAuth = require("../app/controllers/middlewareAuth");
const auth = require("./auth");
const user = require("./user");
const helper = require("./helper");


function router(app) {
  app.use("/auth", auth);
  app.use("/user", user);
  app.use("/helper", helper);

}

module.exports = router;
