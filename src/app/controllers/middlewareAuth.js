const authModel = require("../models/authModel");
const jwt = require("jsonwebtoken");
const middlewareAuth = {
  verifyAuthentication: (req, res, next) => {
    try {
      const token = req.headers.authorization.slice(7);
      if (!token) {
        return res.status(200).json({
          message: "You are not authenticated",
          status: false,
          error: 401,
        });
      }
      jwt.verify(token, process.env.JWT_ACCESS_KEY, (error, user) => {
        if (error) {
          console.log(error);
          return res.status(200).json({
            message: "Your token not valid",
            status: false,
            error: 401,
          });
        }
        req.user = user;
        next();
      });
    } catch (error) {
      console.log("rrororo",error);
      return res.status(200).json({
        message: "Error server verifyAuthentication ",
        status: false,
        error: 501,
      });
    }
  },

  verifyToKenAdminAuth: (req, res, next) => {
    middlewareAuth.verifyAuthentication(req, res, () => {
      // console.log(req.user)
      if (req.user.role_id == 4) {
        next();
      } else {
        return res.status(401).json({
          message: "You're not admin",
          status: false,
        });
      }
    });
  },
  verifyLoginAdmin: async (req, res, next) => {
    const user = await authModel.findAccountById(req.body.id);

    if (user.role_id == 1) {
      return next();
    } else {
      res
        .status(200)
        .json({ message: "Invalid ID Admin", status: true, error: 403 });
    }
  },
};

module.exports = middlewareAuth;
