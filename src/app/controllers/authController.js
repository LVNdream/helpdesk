const authService = require("../services/authService");

class authController {
  async checkId(req, res) {
    try {
      const result = await authService.checkId(req.body);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }
  async register(req, res) {
    try {
      const result = await authService.registerSevice(req.body);
      res.status(200).json(result);
    } catch (error) {
      // console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  }
  async login(req, res) {
    try {
      const result = await authService.login(req.body);
      console.log(result);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async getBackId(req, res) {
    const resutl = await authService.getBackId(req.body);
    res.status(200).json(resutl);
  }
}
module.exports = new authController();
