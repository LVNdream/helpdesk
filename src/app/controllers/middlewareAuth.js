const authModel = require("../models/authModel");
const jwt = require("jsonwebtoken");
const middlewareAuth = {
  verifyAuthentication: (req, res, next) => {
    try {
      // console.log(req.headers.cookies)
      const token = req.headers.authorization.slice(7);
      if (!token) {
        return res.status(401).json({
          message: "You are not authenticated",
          status: false,
          error: 401,
        });
      }
      jwt.verify(token, process.env.JWT_ACCESS_KEY, (error, user) => {
        if (error) {
          console.log(error);
          return res.status(403).json({
            message: "Your token not valid",
            status: false,
            error: 403,
          });
        }
        req.user = user;
        next();
      });
    } catch (error) {
      console.log("rrororo", error);
      return res.status(500).json({
        message: "Error server verifyAuthentication ",
        status: false,
        error: 500,
      });
    }
  },

  verifyToKenAdminAuth: (req, res, next) => {
    middlewareAuth.verifyAuthentication(req, res, () => {
      // console.log(req.user)
      if (req.user.role_id == 3) {
        next();
      } else {
        return res.status(403).json({
          message: "You're not admin",
          status: false,
          error: 403,
        });
      }
    });
  },
  verifyLoginAdmin: async (req, res, next) => {
    const user = await authModel.findAccountById(req.body.id);

    if (user.role_id == 3) {
      return next();
    } else {
      res.status(403).json({
        message: "You are not Admin",
        status: false,
        error: 403,
      });
    }
  },
  verifyNormalUser: async (req, res, next) => {
    const user = await authModel.findAccountById(req.body.id);

    if (user.role_id == 1 || user.role_id == 2 || user.role_id == 4) {
      return next();
    } else {
      res.status(403).json({
        message: "You are not permission login ",
        status: false,
        error: 403,
      });
    }
  },
  verifyToKenHelperAuth: (req, res, next) => {
    middlewareAuth.verifyAuthentication(req, res, () => {
      // console.log(req.user)
      if (req.user.role_id == 1 || req.user.role_id == 2) {
        next();
      } else {
        return res.status(403).json({
          message: "You're not helper",
          status: false,
          rror: 403,
        });
      }
    });
  },
};

module.exports = middlewareAuth;
