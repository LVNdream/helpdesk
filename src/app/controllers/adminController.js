const adminService = require("../services/adminService");
const midService = require("../services/midService");

class adminController {
  // get list request
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
  // search request
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
        req.query.option,
        req.query.text,
        req.query.status_id,
        page
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }
  // get detail request by ID
  async getRequestDetail(req, res) {
    try {
      const result = await adminService.getRequestDetail(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  //  admin list all normal user
  async getAlluser(req, res) {
    try {
      let page;
      if (!req.query.page || !Number(req.query.page)) {
        page = 1;
      } else {
        page = req.query.page;
      }
      const result = await adminService.getAllUser(4, page);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  //  admin get all normal user by search
  async listUserBySearch(req, res) {
    try {
      let page;
      if (!req.query.page || !Number(req.query.page)) {
        page = 1;
      } else {
        page = req.query.page;
      }
      const result = await adminService.listUserBySearch(
        4,
        req.query.option,
        req.query.text,
        page
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // admin get user infor by ID user normal
  async adminGetUserById(req, res) {
    try {
      const result = await adminService.getAdminUserById(req.params.user_id);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // admin get users by ID to approve
  async adminGetUserByIdAccept(req, res) {
    try {
      const result = await adminService.adminGetUserByIdAccept(
        req.params.user_id
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // admin update user status for account
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

  // admin update User infor
  async AdminUpdateUserInfor(req, res) {
    try {
      const result = await adminService.AdminUpdateUserInfor(req.body);
      // console.log(result);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // admin delete user account
  async deleteUser(req, res) {
    try {
      const result = await adminService.deleteUser(
        req.params.user_id,
        req.params.page
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }
  // admin delete user account page registered account
  async deleteDeninedUser(req, res) {
    try {
      const result = await adminService.deleteDeninedUser(
        req.params.user_id,
        req.params.page
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // admin get list helper
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
      res.status(500).json("Server error");
    }
  }

  // admin get list helper by search
  async listHelperBySearch(req, res) {
    try {
      let page;
      if (!req.query.page || !Number(req.query.page)) {
        page = 1;
      } else {
        page = req.query.page;
      }
      const result = await adminService.listHelperBySearch(
        req.query.option,
        req.query.text,
        page
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  //admin get list company to choose company for create helper account
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
      res.status(500).json("Server error");
    }
  }

  //admin get list company to choose company for create helper account by search
  async listCompanyBySearchToAddInfor(req, res) {
    try {
      let page;
      if (!req.query.page || !Number(req.query.page)) {
        page = 1;
      } else {
        page = req.query.page;
      }
      const result = await adminService.listCompanyBySearchToAddInfor(
        req.query.option,
        req.query.text,
        page
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }
  //

  //admin get list company to manage
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
      res.status(500).json("Server error");
    }
  }

  //admin get list company to manage by search
  async listCompanyBySearchToWatch(req, res) {
    try {
      let page;
      if (!req.query.page || !Number(req.query.page)) {
        page = 1;
      } else {
        page = req.query.page;
      }

      const result = await adminService.listCompanyBySearchToWatch(
        req.query.option,
        req.query.text,
        page
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  //admin create account for helper
  async registerHelper(req, res) {
    try {
      const result = await adminService.registerHelper(req.body);
      res.status(200).json(result);
    } catch (error) {
      // console.log(error);
      res.status(500).json({ message: "Server error", error: 500 });
    }
  }

  // get maintenance type
  async getMaintenanceType(req, res) {
    try {
      const result = await adminService.getMaintenanceType();
      res.status(200).json(result);
    } catch (error) {
      // console.log(error);
      res.status(500).json({ message: "Server error", error: 500 });
    }
  }

  // admin get helper infor by ID
  async adminGethlperById(req, res) {
    try {
      const result = await adminService.getAdminHelperById(req.params.user_id);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // admin update helper infor
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

  // check company name in database
  async checkCompanyName(req, res) {
    try {
      const result = await adminService.checkNameCompany(req.body.company_name);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // register company
  async registerCompany(req, res) {
    try {
      const dataRegister = {
        ...req.body,
        creator_id: req.user.id,
      };
      // console.log(dataRegister)
      const result = await adminService.registerCompany(dataRegister);
      res.status(200).json(result);
    } catch (error) {
      // console.log(error);
      res.status(500).json({ message: "Server error", error: 500 });
    }
  }

  // get company infor
  async getCompanyInfor(req, res) {
    try {
      const result = await adminService.getCompanyById(req.params.company_id);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // update company infor
  async updateCompanyInfor(req, res) {
    try {
      const result = await adminService.updateCompanyInfor(req.body);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // admin delete company
  async deleteCompany(req, res) {
    try {
      const result = await adminService.deleteCompany(
        req.params.company_id,
        req.params.page
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // admin deletle label
  async deleteLabel(req, res) {
    try {
      const result = await adminService.deleteLabel(req.params.label_id);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // admin get list user to approve
  async getAlluserWaitAccept(req, res) {
    try {
      let page;
      if (!req.query.page || !Number(req.query.page)) {
        page = 1;
      } else {
        page = req.query.page;
      }
      const result = await adminService.getAllUserWaitAccept(4, page);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // admin get list  user to approve by search
  async listUserWaitAcceptBySearch(req, res) {
    try {
      let page;
      if (!req.query.page || !Number(req.query.page)) {
        page = 1;
      } else {
        page = req.query.page;
      }
      const result = await adminService.listUserWaitAcceptBySearch(
        4,
        req.query.option,
        req.query.text,
        page
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // admin approve user account, change account to normal account
  async updateUserStatusNormal(req, res) {
    try {
      const result = await adminService.updateUserStatus(req.body.user_id, 2);
      // console.log(result);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // admin denined user account
  async updateUserStatusDenied(req, res) {
    try {
      const result = await adminService.updateUserStatus(req.body.user_id, 3);
      // console.log(result);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // admin get list maintenance type detail
  async adminGetMaintenanceType(req, res) {
    try {
      const result = await adminService.adminGetListMaintenanceType();
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // updated label name
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

  //  add label name
  async addNameLabel(req, res) {
    try {
      const result = await adminService.addNameLabel(req.body);
      // console.log(result);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // get all label by maintenance id
  async getListLabel(req, res) {
    try {
      if (!Number(req.params.maintenance_id)) {
        return res.json({
          message: "Params invalid",
          status: false,
          error: "f_params",
        });
      }
      const result = await adminService.getListLabel(req.params.maintenance_id);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // get all label by maintenance id by search
  async listLabelBySearch(req, res) {
    try {
      if (!Number(req.params.maintenance_id)) {
        return res.json({
          message: "Params invalid",
          status: false,
          error: "f_params",
        });
      }
      const result = await adminService.listLabelBySearch(
        req.params.maintenance_id,
        req.query.text
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // get maintenance  class  by Id
  async getMainClassById(req, res) {
    try {
      const result = await adminService.getMaintenanceClassById(
        req.params.maintenance_id
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  //  add label to maintenance class
  async addLabelInMainclass(req, res) {
    try {
      const result = await adminService.addLabelInMainclass(
        req.body.maintenance_id,
        req.body.maintenance_class_id,
        req.body.label_id
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // get report for dashbroad
  async getInforReportCurrent(req, res) {
    try {
      const currentDateTime = new Date(Date.now());
      const week = midService.getWeek(currentDateTime);
      const data = {
        week: week - 1,
        month: currentDateTime.getMonth() + 1,
        year: currentDateTime.getFullYear(),
      };
      // console.log(data);

      const result = await adminService.getInforReport(data);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // get daily report
  async getInforReportDaily(req, res) {
    try {
      let data;
      if (!req.query.year || !req.query.month || !req.query.day) {
        const dateCurrent = new Date(Date.now() - 1000 * 3600 * 24);
        const week = midService.getWeek(dateCurrent);
        data = {
          week: week - 1,
          day: dateCurrent.getDate(),
          month: dateCurrent.getMonth() + 1,
          year: dateCurrent.getFullYear(),
        };
        // console.log(data);
      } else {
        const dateTime = new Date(
          `${req.query.year}-${req.query.month}-${req.query.day}`
        );
        const week = midService.getWeek(dateTime);

        data = {
          week: week - 1,
          day: req.query.day,
          month: req.query.month,
          year: req.query.year,
        };
      }
      // console.log(data)
      const result = await adminService.getInforReportDaily(data);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // get report by week time
  async getInforReportWeek(req, res) {
    try {
      // console.log(req.query);
      const result = await adminService.getInforReportWeek(req.query);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // get report by month time
  async getInforReportMonth(req, res) {
    try {
      const result = await adminService.getInforReportMonthly(req.query);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // get admin infor
  async adminGetInfor(req, res) {
    try {
      const result = await adminService.getAdminInfor(req.user.id);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  //  admin update infor
  async updateAdminInfor(req, res) {
    try {
      const result = await adminService.updateAdminInfor(req.user.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }
}

module.exports = new adminController();
