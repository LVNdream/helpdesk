const adminService = require("../services/adminService");

class adminController {
  async getRequestListAdmin(req, res) {
    try {
      let page;
      if (!req.query.page || !Number(req.query.page)) {
        page = 1;
      } else {
        page = req.query.page;
      }
      const result = await adminService.getRequestListByAdmin(page);
      res.status(200).json(result);
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
      const result = await adminService.getRequestListBySearch(
        req.user.id,
        req.user.role_id,
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
      const result = await adminService.getRequestDetail(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(501).json("Server error");
    }
  }
  async getAlluser(req, res) {
    try {
      let page;
      if (!req.query.page || !Number(req.query.page)) {
        page = 1;
      } else {
        page = req.query.page;
      }
      const result = await adminService.getAllUser(0, page);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(501).json("Server error");
    }
  }

  async listUserBySearch(req, res) {
    try {
      let page;
      if (!req.query.page || !Number(req.query.page)) {
        page = 1;
      } else {
        page = req.query.page;
      }
      const result = await adminService.listUserBySearch(
        0,
        req.body.option,
        req.body.text,
        page
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  async adminGetUserById(req, res) {
    try {
      const result = await adminService.getAdminUserById(req.params.user_id);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }
  async updateUserStatus(req, res) {
    try {
      const result = await adminService.updateUserStatus(
        req.body.user_id,
        req.body.status_id
      );
      console.log(result);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }
  async deleteUser(req, res) {
    try {
      const result = await adminService.deleteUser(req.body.user_id);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  async getAllHelper(req, res) {
    try {
      let page;
      if (!req.query.page || !Number(req.query.page)) {
        page = 1;
      } else {
        page = req.query.page;
      }
      const result = await adminService.getAllHelper(page);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(501).json("Server error");
    }
  }

  async listHelperBySearch(req, res) {
    try {
      let page;
      if (!req.query.page || !Number(req.query.page)) {
        page = 1;
      } else {
        page = req.query.page;
      }
      const result = await adminService.listHelperBySearch(
        req.body.option,
        req.body.text,
        page
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  //
  async getAllCompany(req, res) {
    try {
      let page;
      if (!req.query.page || !Number(req.query.page)) {
        page = 1;
      } else {
        page = req.query.page;
      }
      const result = await adminService.getAllCompany(page);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(501).json("Server error");
    }
  }

  async listCompanyBySearch(req, res) {
    try {
      let page;
      if (!req.query.page || !Number(req.query.page)) {
        page = 1;
      } else {
        page = req.query.page;
      }
      const result = await adminService.listCompanyBySearch(
        req.body.option,
        req.body.text,
        page
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  async registerHelper(req, res) {
    try {
      const result = await adminService.registerHelper(req.body);
      res.status(200).json(result);
    } catch (error) {
      // console.log(error);
      res.status(500).json({ message: "Server error", error: 500 });
    }
  }
  async getMaintenanceType(req, res) {
    try {
      const result = await adminService.getMaintenanceType();
      res.status(200).json(result);
    } catch (error) {
      // console.log(error);
      res.status(500).json({ message: "Server error", error: 500 });
    }
  }
}

module.exports = new adminController();
