const jwt = require("jsonwebtoken");
class jwtService {
  generateAccessToken(data) {
    return jwt.sign(
      data,

      process.env.JWT_ACCESS_KEY,

      {
        expiresIn: process.env.ACCESS_TOKEN_LIFE,
      }
    );
  }

  generateRefreshToken(data) {
    return jwt.sign(
      data,

      process.env.JWT_REFRESHTOKEN_KEY,

      {
        expiresIn: process.env.REFRESH_TOKEN_LIFE,
      }
    );
  }
}

module.exports = new jwtService();
