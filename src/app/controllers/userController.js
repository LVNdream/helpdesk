const userPageService = require("../services/userPageService");

class userController {
  async getRequestList(req, res) {
    try {
      const result = await userPageService.getRequestList();
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }
}
module.exports = new userController();
