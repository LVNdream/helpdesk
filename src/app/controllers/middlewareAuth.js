const middlewareAuth = {
  verifyAuthentication: (req, res, next) => {
    try {
      const token = req.body.accessToken;
      if (!token) {
        return res
          .status(401)
          .json({ message: "You are not authenticated", status: false });
      }

      jwt.verify(token, process.env.JWT_ACCESS_KEY, (error, user) => {
        if (error) {
          console.log(error);
          return res
            .status(401)
            .json({ message: "Your token not valid", status: false });
        }
        req.user = user;
        next();
      });
    } catch (error) {}
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
};

module.exports = middlewareAuth;
