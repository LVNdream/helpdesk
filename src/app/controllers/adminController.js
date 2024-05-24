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
      // console.log(result);
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
  async getAllCompanyToAddInfor(req, res) {
    try {
      let page;
      if (!req.query.page || !Number(req.query.page)) {
        page = 1;
      } else {
        page = req.query.page;
      }
      const result = await adminService.getAllCompanyToAddInfor(page);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(501).json("Server error");
    }
  }

  async listCompanyBySearchToAddInfor(req, res) {
    try {
      let page;
      if (!req.query.page || !Number(req.query.page)) {
        page = 1;
      } else {
        page = req.query.page;
      }
      const result = await adminService.listCompanyBySearchToAddInfor(
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

  //
  async getAllCompanyToWatch(req, res) {
    try {
      let page;
      if (!req.query.page || !Number(req.query.page)) {
        page = 1;
      } else {
        page = req.query.page;
      }
      const result = await adminService.getAllCompanyToWatch(page);
      // console.log(result)
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(501).json("Server error");
    }
  }

  async listCompanyBySearchToWatch(req, res) {
    try {
      let page;
      if (!req.query.page || !Number(req.query.page)) {
        page = 1;
      } else {
        page = req.query.page;
      }
      const result = await adminService.listCompanyBySearchToWatch(
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

  async adminGethlperById(req, res) {
    try {
      const result = await adminService.getAdminHelperById(req.params.user_id);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }
  async updateHelperInfor(req, res) {
    try {
      const result = await adminService.updateHelperInfor(
        req.body.user_id,
        req.body
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }
  async checkCompanyName(req, res) {
    try {
      const result = await adminService.checkNameCompany(req.body.company_name);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  async registerCompany(req, res) {
    try {
      const result = await adminService.registerCompany(req.body);
      res.status(200).json(result);
    } catch (error) {
      // console.log(error);
      res.status(500).json({ message: "Server error", error: 500 });
    }
  }

  async getCompanyInfor(req, res) {
    try {
      const result = await adminService.getCompanyById(req.params.company_id);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(501).json("Server error");
    }
  }
  async updateCompanyInfor(req, res) {
    try {
      const result = await adminService.updateCompanyInfor(req.body);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(501).json("Server error");
    }
  }

  async deleteCompany(req, res) {
    try {
      const result = await adminService.deleteCompany(req.body.company_id);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  async getAlluserWaitAccept(req, res) {
    try {
      let page;
      if (!req.query.page || !Number(req.query.page)) {
        page = 1;
      } else {
        page = req.query.page;
      }
      const result = await adminService.getAllUserWaitAccept(0, page);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(501).json("Server error");
    }
  }

  async listUserWaitAcceptBySearch(req, res) {
    try {
      let page;
      if (!req.query.page || !Number(req.query.page)) {
        page = 1;
      } else {
        page = req.query.page;
      }
      const result = await adminService.listUserWaitAcceptBySearch(
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
  async updateUserStatusNormal(req, res) {
    try {
      const result = await adminService.updateUserStatus(req.body.user_id, 2);
      console.log(result);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }
  async updateUserStatusDenied(req, res) {
    try {
      const result = await adminService.updateUserStatus(req.body.user_id, 3);
      console.log(result);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  async adminGetMaintenanceType(req, res) {
    try {
      const result = await adminService.adminGetListMaintenanceType();
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(501).json("Server error");
    }
  }

  async updateLabelName(req, res) {
    try {
      const result = await adminService.updateLabelName(
        req.body.label_id,
        req.body.name
      );
      // console.log(result);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }
  async addNameLabel(req, res) {
    try {
      const result = await adminService.addNameLabel(req.body.label_name);
      // console.log(result);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  async getListLabel(req, res) {
    try {
      const result = await adminService.getListLabel();
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(501).json("Server error");
    }
  }

  async listLabelBySearch(req, res) {
    try {
      const result = await adminService.listLabelBySearch(req.body.text);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }
}

module.exports = new adminController();
