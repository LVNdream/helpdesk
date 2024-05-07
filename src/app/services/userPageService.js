const userPageModel = require("../models/userPageModel");

class userPageService {
  async getRequestList() {
    try {
      const resutl = await userPageModel.getRequestList();

      return resutl;
    } catch (error) {
      console.log(error);
      return { message: "Server error GetRequestList Sevice", status: false };
    }
  }
}
module.exports = new userPageService();
