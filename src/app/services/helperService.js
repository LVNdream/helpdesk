const helperModel = require("../models/helperModel");

class helperPageService {
  async getRequestListByHelper(role_id) {
    try {
      const resutl = await helperModel.getRequestListByHelper(role_id);

      return resutl
        ? resutl
        : {
            message: "Error model getRequestListByHelper",
            status: false,
            error: 501,
          };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error getRequestListByHelper Sevice",
        status: false,
        error: 500,
      };
    }
  }
}
module.exports = new helperPageService();
