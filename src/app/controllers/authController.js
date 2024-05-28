const authService = require("../services/authService");

class authController {
  async checkId(req, res) {
    try {
      const result = await authService.checkId(req.body);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error: 500 });
    }
  }
  async register(req, res) {
    try {
      const result = await authService.registerSevice(req.body);
      res.status(200).json(result);
    } catch (error) {
      // console.log(error);
      res.status(500).json({ message: "Server error", error: 500 });
    }
  }
  async login(req, res) {
    try {
      const result = await authService.login(req.body);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error: 501 });
    }
  }
  async loginAdmin(req, res) {
    try {
      const result = await authService.loginAdmin(req.body);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error: 501 });
    }
  }

  async getBackId(req, res) {
    try {
      const resutl = await authService.getBackId(req.body);
      res.status(200).json(resutl);
    } catch (error) {
      res.status(500).json({ message: "Server error ", error: 500 });
    }
  }
  async verifyPassword(req, res) {
    try {
      const result = await authService.verifyPassword(
        req.user,
        req.body.password
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error: 501 });
    }
  }
}
module.exports = new authController();
