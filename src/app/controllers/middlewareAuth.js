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
          console.log("error Token", error);
          if (error.name === "TokenExpiredError") {
            return res.status(403).json({
              message: "Your token expried",
              status: false,
              error: "exp_token",
            });
          }
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
  verifyRefreshToken: (req, res, next) => {
    try {
      const refreshToken = req.body.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({
          message: "You dont't have refreshToken",
          status: false,
          error: 401,
        });
      }
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESHTOKEN_KEY,
        (error, user) => {
          if (error) {
            console.log("error refreshToken", error);
            if (error.name === "TokenExpiredError") {
              return res.status(403).json({
                message: "Your refreshToken expried",
                status: false,
                error: "exp_retoken",
              });
            }
            return res.status(403).json({
              message: "Your refreshToken not valid",
              status: false,
              error: 403,
            });
          }
          req.user = user;
          next();
        }
      );
    } catch (error) {
      console.log("error", error);
      return res.status(500).json({
        message: "Error server verifyRefreshToken",
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
        return res.status(200).json({
          message: "You're not admin",
          status: false,
          error: "unauthorized",
        });
      }
    });
  },
  verifyLoginAdmin: async (req, res, next) => {
    const user = await authModel.findAccountById(req.body.id);
    if (!user) {
      return res
        .status(200)
        .json({ message: "Error get account", status: false, error: 500 });
    }
    if (!user.id) {
      return res
        .status(200)
        .json({ message: "Id not valid", status: false, error: "404_id" });
    }
    if (user.role_id == 3) {
      return next();
    } else {
      res.status(200).json({
        message: "You are not Admin",
        status: false,
        error: "unauthorized",
      });
    }
  },
  verifyNormalUser: async (req, res, next) => {
    const user = await authModel.findAccountById(req.body.id);
    if (!user) {
      return res
        .status(200)
        .json({ message: "Error get account", status: false, error: 500 });
    }
    if (!user.id) {
      return res
        .status(200)
        .json({ message: "Id not valid", status: false, error: "404_id" });
    }
    if (user.role_id == 1 || user.role_id == 2 || user.role_id == 4) {
      return next();
    } else {
      res.status(200).json({
        message: "You are not permission login",
        status: false,
        error: "unauthorized",
      });
    }
  },
  verifyToKenHelperAuth: (req, res, next) => {
    middlewareAuth.verifyAuthentication(req, res, () => {
      // console.log(req.user)
      if (req.user.role_id == 1 || req.user.role_id == 2) {
        next();
      } else {
        return res.status(200).json({
          message: "You're not helper",
          status: false,
          error: "unauthorized",
        });
      }
    });
  },
};

module.exports = middlewareAuth;
