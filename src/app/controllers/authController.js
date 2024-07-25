const authService = require("../services/authService");

class authController {
  //  check the existence account name in database
  async checkId(req, res) {
    try {
      const result = await authService.checkId(req.body);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error: 500 });
    }
  }

  // register account
  async register(req, res) {
    try {
      const result = await authService.registerSevice(req.body);
      res.status(200).json(result);
    } catch (error) {
      // console.log(error);
      res.status(500).json({ message: "Server error", error: 500 });
    }
  }

  // login for normal user and supporter
  async login(req, res) {
    try {
      const result = await authService.login(req.body);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error: 500 });
    }
  }

  // login admin
  async loginAdmin(req, res) {
    try {
      const result = await authService.loginAdmin(req.body);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error: 500 });
    }
  }

  // get account name when user forgot password
  async getBackId(req, res) {
    try {
      const resutl = await authService.getBackId(req.body);
      res.status(200).json(resutl);
    } catch (error) {
      res.status(500).json({ message: "Server error ", error: 500 });
    }
  }

  // verify password to change user infor
  async verifyPassword(req, res) {
    try {
      const result = await authService.verifyPassword(
        req.user,
        req.body.password
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error: 500 });
    }
  }

  // update password user
  async updatePassword(req, res) {
    try {
      const result = await authService.updatePassword({
        user_id: req.user.id,
        password: req.body.password,
      });
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error: 500 });
    }
  }

  // get accesstoken when accesstoken expried
  async handleRefreshToken(req, res) {
    try {
      const result = await authService.handleRefreshToken(req.user);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error: 500 });
    }
  }

  // get user name
  async getUserName(req, res) {
    try {
      const resutl = await authService.getNameUser(req.user.id);
      res.status(200).json(resutl);
    } catch (error) {
      res.status(500).json({ message: "Server error ", error: 500 });
    }
  }
}
module.exports = new authController();
