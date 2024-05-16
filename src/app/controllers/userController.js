const userPageService = require("../services/userPageService");
const midService = require("../services/midService");
const fsp  = require("fs").promises;

class userController {
  async getRequestList(req, res) {
    try {
      const result = await userPageService.getRequestList(req.user);

      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }
  async getRequestDetail(req, res) {
    try {
      const result = await userPageService.getRequestDetail(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(501).json("Server error");
    }
  }
  async updateUserInfor(req, res) {
    try {
      const resutl = await userPageService.updateUserInfor(
        req.body,
        req.user.id
      );
      res.status(200).json(resutl);
    } catch (error) {
      console.log(error);
      res.status(501).json("Server error");
    }
  }

  async getRegisterRequest(req, res) {
    try {
      const result = await userPageService.getRegisterRequest(req.user.id);
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(501).json("Server error");
    }
  }
  async userRegisterRequest(req, res) {
    try {
      // const resutl = await midService.deleteFile(req.files)

      // req.files.forEach((file) => {
      //   fsp.rename("./src/public/temps/"+file.filename, "./src/public/files/"+file.filename);
      // });

      return res.status(200).json(123);
    } catch (error) {
      console.log(error);
      res.status(501).json("Server error");
    }
  }
}
module.exports = new userController();
