// ////////
const middlewareAuth = require("../app/controllers/middlewareAuth");
const auth = require("./auth");
const user = require("./user");

function router(app) {
  app.use("/auth", auth);
  app.use("/user", user);
}

module.exports = router;
