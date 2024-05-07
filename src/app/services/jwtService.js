const jwt = require("jsonwebtoken");
class jwtService {
  generateAccessToken(data) {
    return jwt.sign(
      data,

      process.env.JWT_ACCESS_KEY,

      {
        expiresIn: "1d",
      }
    );
  }

  generateRefreshToken(data) {
    return jwt.sign(
      data,

      process.env.JWT_REFRESHTOKEN_KEY,

      {
        expiresIn: "1d",
      }
    );
  }
}

module.exports = new jwtService();
