const helperService = require("../services/helperService");

class helperController {
  async getRequestList(req, res) {
      try {
        console.log(req.user)
      const result = await helperService.getRequestListByHelper(
        req.user.role_id
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }
}
module.exports = new helperController();
