const userPageService = require("../services/userPageService");
const midService = require("../services/midService");
const fsp = require("fs").promises;

class userController {
  async getRequestList(req, res) {
    try {
      let page;
      if (!req.query.page || !Number(req.query.page)) {
        page = 1;
      } else {
        page = req.query.page;
      }

      const result = await userPageService.getRequestList(req.user, page);
      // console.log(result)
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  async getRequestListSearch(req, res) {
    try {
      let page;
      if (!req.query.page || !Number(req.query.page)) {
        page = 1;
      } else {
        page = req.query.page;
      }
      const result = await userPageService.getRequestListBySearch(
        req.user.id,
        req.body.option,
        req.body.text,
        req.body.status_id,
        page
      );
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
      res.status(500).json("Server error");
    }
  }
  async updateUserInfor(req, res) {
    try {
      const resutl = await userPageService.updateUserInfor(
        req.body,
        req.user.id,
        req.user.role_id
      );
      res.status(200).json(resutl);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  async getRegisterRequest(req, res) {
    try {
      const result = await userPageService.getRegisterRequest(req.user.id);
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }
  async userRegisterRequest(req, res) {
    try {
      const data = {
        title_request: req.body.title_request,
        content_request: req.body.content_request,
        maintenance_id: req.body.maintenance_id,
        petitioner_id: req.user.id,
      };
      const files = req.files;
      const result = await userPageService.userRegisterRequest(data, files);
      if (result.status == false) {
        const deleteFile = await midService.deleteFiles(files, "temps");
      }

      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  async updateRegisterRequest(req, res) {
    try {
      const data = {
        petitioner_id: req.user.id,
        title_request: req.body.title_request,
        content_request: req.body.content_request,
        maintenance_id: req.body.maintenance_id,
      };
      const request_id = req.body.request_id;
      const files = req.files;
      const arrayDelete = req.body.arrayDelete;
      // console.log(request_id, data, files, arrayDelete);
      const result = await userPageService.updateRequest(
        request_id,
        data,
        files,
        arrayDelete
      );
      if (result.status == false) {
        const deleteFile = await midService.deleteFiles(files, "temps");
      }

      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }
  async deleteRequest(req, res) {
    try {
      const result = await userPageService.deleteRequest(
        req.user.id,
        req.params.request_id
      );
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }
  async getUserInfor(req, res) {
    try {
      const result = await userPageService.getUserInfor(
        req.user.id,
        req.user.role_id
      );

      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  async getStatus(req, res) {
    try {
      const result = await userPageService.getStatus();

      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }
}
module.exports = new userController();
