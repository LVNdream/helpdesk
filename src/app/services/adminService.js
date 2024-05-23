const helperModel = require("../models/helperModel");
const userPageModel = require("../models/userPageModel");
const midService = require("./midService");
const adminModel = require("../models/adminModel");
const authModel = require("../models/authModel");
const bcrypt = require("bcryptjs");

class adminPageService {
  async getRequestListByAdmin(page) {
    try {
      const resutl = await adminModel.getRequestListByAdmin(page);

      const requestCount = await adminModel.getAdminRequestCount();

      return resutl
        ? { data: resutl, requestCount: parseInt(requestCount) }
        : {
            message: "Error model getRequestList By Admin",
            status: false,
            error: 501,
          };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error getRequestList By Admin Sevice",
        status: false,
        error: 500,
      };
    }
  }

  async getRequestListBySearch(
    user_id,
    role_id,
    option,
    text,
    status_id,
    page
  ) {
    try {
      const resutl = await adminModel.requestListBySearchText(
        user_id,
        role_id,
        option,
        text,
        status_id,
        page
      );
      return resutl
        ? { data: resutl.listFilter, requestCount: resutl.requestCount }
        : {
            message: "Error model getRequestList By search",
            status: false,
            error: 501,
          };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error getRequestList By search Sevice",
        status: false,
        error: 500,
      };
    }
  }

  async getRequestDetail(id) {
    try {
      const status_id = await userPageModel.getIdStatusByRequest(id);

      if (!status_id) {
        return { message: "Id request not valid", status: false, error: 404 };
      }
      // tang thai dang ki va dang tien hanh
      if (status_id == 1 || status_id == 2 || status_id == 3) {
        const resutlConfirm_Register =
          await userPageModel.getRequestConfirm_Register(id);
        // console.log(resutlConfirm_Register)
        const MT_Register = await midService.getMaintenanceType_checked(
          resutlConfirm_Register.maintenance_id
        );
        delete resutlConfirm_Register.maintenance_id;
        const listProblem_RQ =
          status_id == 3
            ? await userPageModel.getAllProblemByRequest_id(
                resutlConfirm_Register.id
              )
            : [];

        const files = await userPageModel.getAllFileByRequest(id);
        if (!files) {
          return {
            message: "Error get file by request",
            status: false,
            error: 501,
          };
        }
        return resutlConfirm_Register
          ? {
              recipient_id: resutlConfirm_Register.recipient_id,
              id: resutlConfirm_Register.id,
              title_request: resutlConfirm_Register.title_request,
              content_request: resutlConfirm_Register.content_request,
              maintenance_id: resutlConfirm_Register.maintenance_id,

              method_name: resutlConfirm_Register.method_name,

              solution_name: resutlConfirm_Register.solution_name,
              created_at: resutlConfirm_Register.created_at,
              infor_petitioner: {
                user_id: resutlConfirm_Register.user_id,
                name: resutlConfirm_Register.name,
                affiliated_department:
                  resutlConfirm_Register.affiliated_department,
                phone_number: resutlConfirm_Register.phone_number,
                position: resutlConfirm_Register.position,
                email: resutlConfirm_Register.email,
              },

              MT_Register,
              status_id,
              listProblem_RQ,
              files,
            }
          : {
              message: "Error model getRequestConfirm_Register",
              status: false,
              error: 501,
            };
      }
      if (status_id == 4 || status_id == 5) {
        const resutlComplete_AddProblem =
          await userPageModel.getRequestCompleted(id);
        // lay ra cach maintenance
        const MT_Register = await midService.getMaintenanceType_checked(
          resutlComplete_AddProblem.maintenance_id
        );

        const resutlProcessingDetail =
          await userPageModel.getMaintenanceClassRequest(id);

        const listMT_detail = Promise.all(
          MT_Register.map(async (item) => {
            const resutlMainClass = await userPageModel.getMaintenanceClassId(
              item.id
            );
            if (!resutlMainClass) {
              return {
                message: "Serve have error in getMaintenanceClassRequest",
                status: false,
                error: 501,
              };
            }
            if (!resutlProcessingDetail) {
              return {
                message: "Serve have error in ProcessingDetail",
                status: false,
                error: 501,
              };
            }
            // console.log(resutlProcessingDetail);
            const maintenanceClass = resutlMainClass.map((itemMC) => {
              let checked = false;
              resutlProcessingDetail.forEach((itemPD) => {
                if (itemMC.label_id == itemPD.label_id) {
                  checked = true;
                }
              });
              return {
                mc_id: itemMC.mc_id,

                label_name: itemMC.label_name,
                group_m: itemMC.group_m,
                checked,
              };
            });
            if (item.id == 1) {
              const maintenanceClass_class1 = maintenanceClass.filter(
                (itemMC) => {
                  return itemMC.group_m == 1;
                }
              );
              const maintenanceClass_class2 = maintenanceClass.filter(
                (itemMC) => {
                  return itemMC.group_m == 2;
                }
              );
              return {
                ...item,
                maintenanceClass: [
                  { name: "H/W", data: maintenanceClass_class1 },
                  { name: "S/W", data: maintenanceClass_class2 },
                ],
              };
            } else if (item.id == 2) {
              const maintenanceClass_class1 = maintenanceClass.filter(
                (itemMC) => {
                  return itemMC.group_m == 1;
                }
              );
              const maintenanceClass_class2 = maintenanceClass.filter(
                (itemMC) => {
                  return itemMC.group_m == 2;
                }
              );
              return {
                ...item,
                maintenanceClass: [
                  { name: "전산부분", data: maintenanceClass_class1 },
                  {
                    name: "일반부분",
                    data: maintenanceClass_class2,
                  },
                ],
              };
            }
          })
        );
        let final_MT = await listMT_detail;

        ////////////////////////////////
        delete resutlComplete_AddProblem.maintenance_id;
        const listProblem_RQ =
          status_id == 5
            ? await userPageModel.getAllProblemByRequest_id(
                resutlComplete_AddProblem.id
              )
            : [];
        const files = await userPageModel.getAllFileByRequest(id);
        if (!files) {
          return {
            message: "Error get file by request",
            status: false,
            error: 501,
          };
        }
        return resutlComplete_AddProblem
          ? {
              id: resutlComplete_AddProblem.id,
              title_request: resutlComplete_AddProblem.title_request,
              content_request: resutlComplete_AddProblem.content_request,
              created_at: resutlComplete_AddProblem.created_at,
              processing_content_problem:
                resutlComplete_AddProblem.processing_content_problem,
              solution_name: resutlComplete_AddProblem.solution_name,
              method_name: resutlComplete_AddProblem.method_name,

              infor_petitioner: {
                user_id: resutlComplete_AddProblem.petitioner_id,
                name: resutlComplete_AddProblem.p_name,
                affiliated_department:
                  resutlComplete_AddProblem.p_affiliated_department,
                phone_number: resutlComplete_AddProblem.p_phone_number,
                position: resutlComplete_AddProblem.p_position,
                email: resutlComplete_AddProblem.p_email,
              },
              infor_recipient: {
                user_id: resutlComplete_AddProblem.r_id,
                name: resutlComplete_AddProblem.r_name,
                affiliated_department:
                  resutlComplete_AddProblem.r_affiliated_department,
                phone_number: resutlComplete_AddProblem.r_phone_number,
                position: resutlComplete_AddProblem.r_position,
                email: resutlComplete_AddProblem.r_email,
              },
              MT_Register: final_MT,
              status_id,
              status_name: resutlComplete_AddProblem.status_name,
              listProblem_RQ,
              files,
            }
          : {
              message: "Error model getRequestConfirm_Register",
              status: false,
              error: 501,
            };
      }
    } catch (error) {
      console.log(error);
      return { message: "Server error GetRequestDetail Sevice", status: false };
    }
  }

  async getAllUser(role_id, page) {
    try {
      const resutl = await adminModel.getAllUser(role_id, page);

      const userCount = await adminModel.getUserCount(role_id);

      return resutl
        ? { data: resutl, userCount: parseInt(userCount) }
        : {
            message: "Error model getAllUser By Admin",
            status: false,
            error: 501,
          };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error getAllUser By Admin Sevice",
        status: false,
        error: 500,
      };
    }
  }

  async listUserBySearch(role_id, option, text, page) {
    try {
      const resutl = await adminModel.listUserBySearchText(
        role_id,
        option,
        text,
        page
      );
      return resutl
        ? {
            data: resutl.listFilter,
            requestCount: parseInt(resutl.requestCount),
          }
        : {
            message: "Error model get list user By search",
            status: false,
            error: 501,
          };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error get list User By search Sevice",
        status: false,
        error: 500,
      };
    }
  }

  //
  async getAllHelper(page) {
    try {
      const resutl = await adminModel.getAllHelper(page);

      const userCount = await adminModel.getHelperCount();

      return resutl
        ? { data: resutl, userCount: parseInt(userCount) }
        : {
            message: "Error model getAllHepler By Admin",
            status: false,
            error: 501,
          };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error getAllHelper By Admin Sevice",
        status: false,
        error: 500,
      };
    }
  }

  async listHelperBySearch(option, text, page) {
    try {
      const resutl = await adminModel.listHelperBySearchText(
        option,
        text,
        page
      );
      return resutl
        ? {
            data: resutl.listFilter,
            requestCount: parseInt(resutl.requestCount),
          }
        : {
            message: "Error model get list helper By search",
            status: false,
            error: 501,
          };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error get list helper By search Sevice",
        status: false,
        error: 500,
      };
    }
  }
  //

  //
  async getAllCompany(page) {
    try {
      const resutl = await adminModel.getAllCompany(page);

      const userCount = await adminModel.getCompanyrCount();

      return resutl
        ? { data: resutl, userCount: parseInt(userCount) }
        : {
            message: "Error model getcompany By Admin",
            status: false,
            error: 501,
          };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error getcompany By Admin Sevice",
        status: false,
        error: 500,
      };
    }
  }

  async listCompanyBySearch(option, text, page) {
    try {
      const resutl = await adminModel.listCompanyBySearchText(
        option,
        text,
        page
      );
      return resutl
        ? {
            data: resutl.listFilter,
            requestCount: parseInt(resutl.requestCount),
          }
        : {
            message: "Error model get list company By search",
            status: false,
            error: 501,
          };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error get list company By search Sevice",
        status: false,
        error: 500,
      };
    }
  }
  //

  async getAdminUserById(user_id) {
    try {
      const resutl = await adminModel.adminGetUserInfor(user_id);

      let listStatus = await adminModel.adminGetAccountStatus();

      listStatus = listStatus.map((item) => {
        let checked = false;
        if (item.id == resutl.status_id) {
          checked = true;
        }
        return {
          ...item,
          checked,
        };
      });

      return resutl
        ? {
            ...resutl,
            statusList: listStatus,
          }
        : {
            message: "Error model getAllUser By Admin",
            status: false,
            error: 501,
          };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error getAllUser By Admin Sevice",
        status: false,
        error: 500,
      };
    }
  }
  async updateUserStatus(user_id, status_id) {
    try {
      const resutl = await adminModel.updateUserStatus(user_id, status_id);

      return resutl
        ? {
            message: "Update status success",
            status: true,
          }
        : {
            message: "Error model update User Status By Admin",
            status: false,
            error: 501,
          };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error getAllUser By Admin Sevice",
        status: false,
        error: 500,
      };
    }
  }
  async deleteUser(user_id) {
    try {
      const resutl = await adminModel.deleteUser(user_id);

      return resutl
        ? {
            message: "delete user success",
            status: true,
          }
        : {
            message: "Error model delete user  By Admin",
            status: false,
            error: 501,
          };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error delete user By Admin Sevice",
        status: false,
        error: 500,
      };
    }
  }

  async getMaintenanceType() {
    try {
      const resutl = await userPageModel.getMaintenanceType();

      return resutl
        ? resutl
        : {
            message: "Error model getMaintenance By Admin",
            status: false,
            error: 501,
          };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error getMaintenance By Admin Sevice",
        status: false,
        error: 500,
      };
    }
  }

  async registerHelper(data) {
    try {
      const exist = await authModel.checkExistId(data.id);

      if (exist) {
        if (exist.status == false) {
          return {
            message: exist.message,
            status: exist.status,
            error: exist.error,
          };
        } else {
          const password_hash = bcrypt.hashSync(data.password, 8);
          const dataRegister = {
            ...data,
            password: password_hash,
            status_id: 2,
            role_id: data.role_id,
          };
          console.log(dataRegister);
          const resultRegister = await adminModel.registerHelper(dataRegister);

          return resultRegister
            ? resultRegister
            : { message: "Registered fail", status: false, error: 501 };
        }
      } else {
        return { message: "Server error find ID", status: false, error: 501 };
      }
    } catch (error) {
      console.log(error);
      return {
        message: "Server error register helper",
        status: false,
        error: 501,
      };
    }
  }
}
module.exports = new adminPageService();
