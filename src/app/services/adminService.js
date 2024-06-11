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
            error: 500,
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
        ? {
            data: resutl.listFilter,
            requestCount: resutl.requestCount,
          }
        : {
            message: "Error model getRequestList By search",
            status: false,
            error: 500,
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
            error: 500,
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
              error: 500,
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
            const listMaintenanceClass =
              await userPageModel.getMaintenanceClassId(item.id);
            if (!listMaintenanceClass) {
              return {
                message: "Serve have error in getMaintenanceClassRequest",
                status: false,
                error: 500,
              };
            }
            if (!resutlProcessingDetail) {
              return {
                message: "Serve have error in ProcessingDetail",
                status: false,
                error: 500,
              };
            }
            // console.log(resutlProcessingDetail);
            const maintenanceClass = listMaintenanceClass.map((itemMC) => {
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
            error: 500,
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
              error: 500,
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

      let listStatus = await adminModel.adminGetAccountStatus();
      if (!listStatus) {
        return {
          message: "Error model  get listStatus",
          status: false,
          error: 500,
        };
      }
      // listStatus.push({ id: user.id, status_name: user.status_name });
      const listUserFilterStatus = resutl.map((user) => {
        let listStatusCheck = listStatus.map((item) => {
          let checked = false;
          item.id == user.status_id ? (checked = true) : (checked = false);
          return { ...item, checked };
        });

        const listStatusLength = listStatusCheck.length;
        let isExisted = false;
        for (let i = 0; i < listStatusLength; i++) {
          const item = listStatusCheck[i];
          // console.log(item)
          if (item.checked) {
            isExisted = true;
            break;
          }
        }

        !isExisted
          ? listStatusCheck.push({
              id: user.status_id,
              status_name: user.status_name,
              checked: true,
            })
          : listStatusCheck;

        delete user.status_id;
        delete user.status_name;
        return {
          ...user,
          listStatusCheck,
        };
      });

      return resutl
        ? { data: listUserFilterStatus, userCount: parseInt(userCount) }
        : {
            message: "Error model getAllUser By Admin",
            status: false,
            error: 500,
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

      let listStatus = await adminModel.adminGetAccountStatus();
      if (!listStatus) {
        return {
          message: "Error model  get listStatus",
          status: false,
          error: 500,
        };
      }
      // listStatus.push({ id: user.id, status_name: user.status_name });
      const listUserFilterStatus = resutl.listFilter.map((user) => {
        let listStatusCheck = listStatus.map((item) => {
          let checked = false;
          item.id == user.status_id ? (checked = true) : (checked = false);
          return { ...item, checked };
        });

        const listStatusLength = listStatusCheck.length;
        let isExisted = false;
        for (let i = 0; i < listStatusLength; i++) {
          const item = listStatusCheck[i];
          // console.log(item)
          if (item.checked) {
            isExisted = true;
            break;
          }
        }

        !isExisted
          ? listStatusCheck.push({
              id: user.status_id,
              status_name: user.status_name,
              checked: true,
            })
          : listStatusCheck;

        delete user.status_id;
        delete user.status_name;
        return {
          ...user,
          listStatusCheck,
        };
      });
      return resutl
        ? {
            data: listUserFilterStatus,
            requestCount: parseInt(resutl.requestCount),
          }
        : {
            message: "Error model get list user By search",
            status: false,
            error: 500,
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
      let resutl = await adminModel.getAllHelper(page);

      const userCount = await adminModel.getHelperCount();

      // loc cac helper ow trang thaiu bth neu muon sua thi vo model thay doi status
      return resutl
        ? { data: resutl, userCount: parseInt(userCount) }
        : {
            message: "Error model getAllHepler By Admin",
            status: false,
            error: 500,
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

      // loc cac helper ow trang thaiu bth neu muon sua thi vo model thay doi status
      return resutl
        ? {
            data: resutl.listFilter,
            requestCount: parseInt(resutl.requestCount),
          }
        : {
            message: "Error model get list helper By search",
            status: false,
            error: 500,
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
  async getAllCompanyToAddInfor(page) {
    try {
      let resutl = await adminModel.getAllCompanyToAddInfor(page);

      const companyCount = await adminModel.getCompanyrCountToAddInfor();

      return resutl
        ? { data: resutl, companyCount: parseInt(companyCount) }
        : {
            message: "Error model getcompany By Admin",
            status: false,
            error: 500,
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

  async listCompanyBySearchToAddInfor(option, text, page) {
    try {
      const resutl = await adminModel.listCompanyBySearchTextToAddInfor(
        option,
        text,
        page
      );
      return resutl
        ? {
            data: resutl.listFilter,
            companyCount: parseInt(resutl.requestCount),
          }
        : {
            message: "Error model get list company By search",
            status: false,
            error: 500,
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
      // console.log(re)
      let listStatus = await adminModel.adminGetAccountStatus();

      let listStatusCheck = listStatus.map((item) => {
        let checked = false;
        item.id == resutl.status_id ? (checked = true) : (checked = false);
        return { ...item, checked };
      });
      const listStatusLength = listStatusCheck.length;
      let isExisted = false;
      for (let i = 0; i < listStatusLength; i++) {
        const item = listStatusCheck[i];
        // console.log(item)
        if (item.checked) {
          isExisted = true;
          break;
        }
      }

      !isExisted
        ? listStatusCheck.push({
            id: resutl.status_id,
            status_name: resutl.status_name,
            checked: true,
          })
        : listStatusCheck;

      delete resutl.status_id;
      delete resutl.status_name;
      return resutl
        ? {
            ...resutl,
            listStatusCheck,
          }
        : {
            message: "Error model getAllUser By Admin",
            status: false,
            error: 500,
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
  async adminGetUserByIdAccept(user_id) {
    try {
      const resutl = await adminModel.adminGetUserInfor(user_id);

      return resutl
        ? resutl
        : {
            message: "Error model adminGetUserByIdAccept",
            status: false,
            error: 500,
          };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error adminGetUserByIdAccept Sevice",
        status: false,
        error: 500,
      };
    }
  }
  async updateUserStatus(user_id, status_id) {
    try {
      const resutl = await adminModel.updateUserStatus(user_id, status_id);

      if (!resutl) {
        return {
          message: "Error model update User Status By Admin",
          status: false,
          error: 500,
        };
      }

      let updateInfor = await adminModel.getNewUser(user_id);
      if (!updateInfor) {
        return {
          message: "Error model get new user By Admin",
          status: false,
          error: 500,
        };
      }
      return {
        data: {
          user_id: updateInfor.id,
          status_id: updateInfor.status_id,
          status_name: updateInfor.status_name,
        },
        message: "Update status success",
        status: true,
      };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error updateUserStatus Admin Sevice",
        status: false,
        error: 500,
      };
    }
  }
  async AdminUpdateUserInfor(data) {
    try {
      const resutl = await adminModel.AdminUpdateUserInfor(data);
      let updateInfor;
      if (!resutl) {
        return {
          message: "Error model AdminUpdateUserInfor",
          status: false,
          error: 500,
        };
      }
      updateInfor = await adminModel.getNewUser(data.user_id);
      // console.log(updateInfor);
      let listStatus = await adminModel.adminGetAccountStatus();
      if (!listStatus) {
        return {
          message: "Error model  get listStatus",
          status: false,
          error: 500,
        };
      }
      let listStatusCheck = listStatus.map((item) => {
        let checked = false;
        item.id == updateInfor.status_id ? (checked = true) : (checked = false);
        return { ...item, checked };
      });
      const listStatusLength = listStatusCheck.length;
      let isExisted = false;
      for (let i = 0; i < listStatusLength; i++) {
        const item = listStatusCheck[i];
        // console.log(item)
        if (item.checked) {
          isExisted = true;
          break;
        }
      }

      !isExisted
        ? listStatusCheck.push({
            id: updateInfor.status_id,
            status_name: updateInfor.status_name,
            checked: true,
          })
        : listStatusCheck;

      delete updateInfor.status_id;
      delete updateInfor.status_name;

      return {
        data: { ...updateInfor, listStatusCheck },
        message: " AdminUpdateUserInfor success",
        status: true,
      };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error AdminUpdateUserInfor Admin Sevice",
        status: false,
        error: 500,
      };
    }
  }
  async deleteUser(user_id) {
    try {
      const getUser = await userPageModel.getUserInfor(user_id);

      if (!getUser) {
        return {
          message: "Not found ID ",
          status: false,
          error: "u_404",
        };
      }
      const resutl = await adminModel.deleteUser(user_id);

      return resutl
        ? {
            deleteId: user_id,
            message: "delete user success",
            status: true,
          }
        : {
            message: "Error model delete user  By Admin",
            status: false,
            error: 500,
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
            error: 500,
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
          let password_hash;
          if (data.password) {
            password_hash = bcrypt.hashSync(data.password, 8);
          }
          const dataRegister = {
            ...data,
            password: password_hash,
            status_id: 2,
            role_id: data.role_id,
          };
          // console.relog(dataRegister);
          const resultRegister = await adminModel.registerHelper(dataRegister);
          // console.log(resultRegister);
          let newHelper = {};
          if (resultRegister) {
            const newUser_id = resultRegister.insertId;
            newHelper = await adminModel.getNewHelper(newUser_id);
          }

          return resultRegister
            ? {
                message: "Registered helper Successfully",
                status: true,
                data: newHelper,
              }
            : { message: "Registered fail", status: false, error: 500 };
        }
      } else {
        return { message: "Server error find ID", status: false, error: 500 };
      }
    } catch (error) {
      console.log(error);
      return {
        message: "Server error register helper",
        status: false,
        error: 500,
      };
    }
  }

  async getAdminHelperById(user_id) {
    try {
      const resutl = await adminModel.adminGetHelperInfor(user_id);

      let listStatus = await adminModel.adminGetAccountStatus();

      listStatus = listStatus.map((item) => {
        let checked = false;
        if (item.id == resutl.status_id) {
          checked = true;
        }
        return {
          id: item.id,
          name: item.status_name,
          checked,
        };
      });
      const listRole = await midService.getMaintenanceType_checked(
        resutl.role_id
      );

      return resutl
        ? {
            ...resutl,
            statusList: listStatus,
            main_type: listRole,
          }
        : {
            message: "Error model getAllUser By Admin",
            status: false,
            error: 500,
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

  async updateHelperInfor(user_id, data) {
    try {
      const resutl = await adminModel.updateHelperInfor(user_id, data);
      if (resutl) {
        const inforUpdate = await adminModel.getNewHelper(user_id);
        return {
          data: inforUpdate,
          message: "Update helper infor success",
          status: true,
        };
      } else {
        return {
          message: "Error model update User helper infor By Admin",
          status: false,
          error: 500,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        message: "Server error update helper infor By Admin Sevice",
        status: false,
        error: 500,
      };
    }
  }

  async checkNameCompany(name_company) {
    try {
      const resutl = await adminModel.checkCompanyName(name_company);

      return resutl
        ? resutl
        : {
            message: "Error model checkNameCompany By Admin",
            status: false,
            error: 500,
          };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error checkNameCompany By Admin Sevice",
        status: false,
        error: 500,
      };
    }
  }

  //
  async getAllCompanyToWatch(page) {
    try {
      let resutl = await adminModel.getAllCompanyToWatch(page);
      resutl = resutl.map((item) => {
        return {
          ...item,
          amountHelper: parseInt(item.amountHelper),
          owner: "Admin",
        };
      });
      const companyCount = await adminModel.getCompanyCountToWatch();

      return resutl
        ? { data: resutl, companyCount: parseInt(companyCount) }
        : {
            message: "Error model getcompany By Admin",
            status: false,
            error: 500,
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

  async listCompanyBySearchToWatch(option, text, page) {
    try {
      let resutl = await adminModel.listCompanyBySearchTextToWatch(
        option,
        text,
        page
      );

      resutl.listFilter = resutl.listFilter.map((item) => {
        return {
          ...item,
          amountHelper: parseInt(item.amountHelper),
          owner: "Admin",
        };
      });

      return resutl
        ? {
            data: resutl.listFilter,
            companyCount: parseInt(resutl.requestCount),
          }
        : {
            message: "Error model get list company By search",
            status: false,
            error: 500,
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

  async registerCompany(data) {
    try {
      const exist = await adminModel.checkCompanyName(data.name_company);

      if (exist) {
        if (exist.status == false) {
          return {
            message: exist.message,
            status: exist.status,
            error: exist.error,
          };
        } else {
          const resultRegister = await adminModel.registerCompany(data);
          // console.log(resultRegister)
          if (!resultRegister) {
            return { message: "Registered fail", status: false, error: 500 };
          }
          let newCompany = await adminModel.getNewCompany(
            resultRegister.insertId
          );
          return {
            data: {
              ...newCompany,
              amountHelper: parseInt(newCompany.amountHelper),
              owner: "Admin",
            },
            message: "Register success",
            status: true,
          };
        }
      } else {
        return {
          message: "Server error find company",
          status: false,
          error: 500,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        message: "Server error register helper",
        status: false,
        error: 500,
      };
    }
  }

  async getCompanyById(company_id) {
    try {
      const resutl = await adminModel.getCompanyInforById(company_id);

      return resutl
        ? resutl
        : {
            message: "Error model getcompany By Id",
            status: false,
            error: 500,
          };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error getcompany By Id Sevice",
        status: false,
        error: 500,
      };
    }
  }

  async updateCompanyInfor(data) {
    try {
      const resultUpdate = await adminModel.updateCompanyInfor(data);

      if (!resultUpdate) {
        return { message: "Update fail", status: false, error: 500 };
      }
      let updateInfor = await adminModel.getNewCompany(data.company_id);
      return {
        data: {
          ...updateInfor,
          amountHelper: parseInt(updateInfor.amountHelper),
        },
        message: "Update success",
        status: true,
      };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error Update Company",
        status: false,
        error: 500,
      };
    }
  }

  async deleteCompany(company_id) {
    try {
      const resutl = await adminModel.deleteCompany(company_id);

      return resutl
        ? {
            deleteId: company_id,
            message: "delete company success",
            status: true,
          }
        : {
            message: "Error model delete company  By Admin",
            status: false,
            error: 500,
          };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error delete company By Admin Sevice",
        status: false,
        error: 500,
      };
    }
  }

  async getAllUserWaitAccept(role_id, page) {
    try {
      let resutl = await adminModel.getAllUserWaitAccept(role_id, page);

      const userCount = await adminModel.getUserCountWaitAccept(role_id);

      // let listStatus = await adminModel.adminGetAccountStatusWaitAccept();

      // resutl = resutl.map((user) => {
      //   let listStatusCheck = listStatus.map((item) => {
      //     let checked = false;
      //     item.id == user.status_id ? (checked = true) : (checked = false);
      //     return { ...item, checked };
      //   });
      //   delete user.status_id;
      //   delete user.status_name;
      //   return {
      //     ...user,
      //     listStatusCheck,
      //   };
      // });
      return resutl
        ? { data: resutl, userCount: parseInt(userCount) }
        : {
            message: "Error model getAllUser wait accept By Admin",
            status: false,
            error: 500,
          };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error getAllUser wait accept By Admin Sevice",
        status: false,
        error: 500,
      };
    }
  }

  async listUserWaitAcceptBySearch(role_id, option, text, page) {
    try {
      let resutl = await adminModel.listUserWaitAcceptBySearchText(
        role_id,
        option,
        text,
        page
      );
      // console.log(resutl)
      // let listStatus = await adminModel.adminGetAccountStatusWaitAccept();

      // const listUserFilterStatus = resutl.listFilter.map((user) => {
      //   let listStatusCheck = listStatus.map((item) => {
      //     let checked = false;
      //     item.id == user.status_id ? (checked = true) : (checked = false);
      //     return { ...item, checked };
      //   });
      //   delete user.status_id;
      //   delete user.status_name;
      //   return {
      //     ...user,
      //     listStatusCheck,
      //   };
      // });
      return resutl
        ? {
            data: resutl.listFilter,
            requestCount: parseInt(resutl.requestCount),
          }
        : {
            message: "Error model get list user wait accept By search",
            status: false,
            error: 500,
          };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error get list User wait accept By search Sevice",
        status: false,
        error: 500,
      };
    }
  }

  async adminGetListMaintenanceType() {
    try {
      const listMaintenanceType = await userPageModel.getMaintenanceType();
      const listMT_detail = Promise.all(
        listMaintenanceType.map(async (item) => {
          const listMaintenanceClass =
            await userPageModel.getMaintenanceClassId(item.id);
          if (!listMaintenanceClass) {
            return {
              message: "Serve have error in getMaintenanceClassRequest",
              status: false,
              error: 500,
            };
          }

          if (item.id == 1) {
            let maintenanceClass_class1 = listMaintenanceClass.filter(
              (itemMC) => {
                return itemMC.group_m == 1;
              }
            );

            let maintenanceClass_class2 = listMaintenanceClass.filter(
              (itemMC) => {
                return itemMC.group_m == 2;
              }
            );
            maintenanceClass_class1 = maintenanceClass_class1.map((itemMC) => {
              delete itemMC.mc_id;
              delete itemMC.group_m;

              return itemMC;
            });
            maintenanceClass_class2 = maintenanceClass_class2.map((itemMC) => {
              delete itemMC.mc_id;
              delete itemMC.group_m;

              return itemMC;
            });
            return {
              ...item,
              maintenanceClass: [
                { name: "H/W", data: maintenanceClass_class1 },
                { name: "S/W", data: maintenanceClass_class2 },
              ],
            };
          } else if (item.id == 2) {
            let maintenanceClass_class1 = listMaintenanceClass.filter(
              (itemMC) => {
                return itemMC.group_m == 1;
              }
            );
            let maintenanceClass_class2 = listMaintenanceClass.filter(
              (itemMC) => {
                return itemMC.group_m == 2;
              }
            );
            maintenanceClass_class1 = maintenanceClass_class1.map((itemMC) => {
              delete itemMC.mc_id;
              delete itemMC.group_m;

              return itemMC;
            });
            maintenanceClass_class2 = maintenanceClass_class2.map((itemMC) => {
              delete itemMC.mc_id;
              delete itemMC.group_m;

              return itemMC;
            });
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
      let result = await listMT_detail;
      return result
        ? result
        : {
            message: "Error model Admin getmaintenance class",
            status: false,
            error: 500,
          };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error Admin getmaintenance class Sevice",
        status: false,
        error: 500,
      };
    }
  }

  async updateLabelName(label_id, name) {
    try {
      const resultUpdate = await adminModel.updateLabelName(label_id, name);

      return resultUpdate
        ? {
            label_id,
            label_name: name,
            message: "Update label name success",
            status: true,
          }
        : { message: "Update fail", status: false, error: 500 };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error Update label Name",
        status: false,
        error: 500,
      };
    }
  }
  async addNameLabel(name) {
    try {
      const resultRegister = await adminModel.addNameLabel(name);

      return resultRegister
        ? {
            data: {
              label_id: parseInt(resultRegister.insertId),
              label_name: name,
            },

            message: "Registered name label Successfully",
            status: true,
          }
        : { message: "Registered fail", status: false, error: 500 };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error register label name",
        status: false,
        error: 500,
      };
    }
  }

  async getListLabel(maintenance_id) {
    try {
      const resutlLabel = await adminModel.getListLabel(maintenance_id);

      let resutlMainClass = await userPageModel.getMaintenanceClassId(
        maintenance_id
      );
      resutlMainClass = resutlMainClass.map((item) => {
        return {
          mc_id: item.mc_id,
          group_m: item.group_m,
        };
      });
      let resutlMainClassGroup = await userPageModel.getMainclassGroupById(
        maintenance_id
      );
      let mainClassFilter;
      resutlMainClassGroup = resutlMainClassGroup.map((mc_group) => {
        (mainClassFilter = resutlMainClass.filter((item) => {
          return mc_group.group_m == item.group_m;
        })),
          (mainClassFilter = mainClassFilter.map((item) => {
            // delete item.group_m;
            return item;
          }));
        return {
          name:
            maintenance_id == 1
              ? mc_group.group_m == 1
                ? "H/W"
                : "S/W"
              : mc_group.group_m == 2
              ? "전산부분"
              : "일반부분",

          data: mainClassFilter,
        };
      });
      return resutlLabel && resutlMainClass
        ? { listLabel: resutlLabel, mainClass: resutlMainClassGroup }
        : {
            message: "Error model getListLabel By Admin",
            status: false,
            error: 500,
          };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error getListLabel By Admin Sevice",
        status: false,
        error: 500,
      };
    }
  }

  async listLabelBySearch(maintenance_id, text) {
    try {
      const resutl = await adminModel.listLabelBySearchText(
        maintenance_id,
        text
      );
      return resutl
        ? resutl
        : {
            message: "Error model get lisLabelBySearch",
            status: false,
            error: 500,
          };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error get lisLabelBySearch Sevice",
        status: false,
        error: 500,
      };
    }
  }
  async getMaintenanceClassById(maintenance_id) {
    try {
      let resutlMainClass = await userPageModel.getMaintenanceClassId(
        maintenance_id
      );
      if (!resutlMainClass) {
        return {
          message: "Error model getMaintenanceClassById",
          status: false,
          error: 500,
        };
      }
      resutlMainClass = resutlMainClass.map((item) => {
        return {
          mc_id: item.mc_id,
          group_m: item.group_m,
        };
      });
      let resutlMainClassGroup = await userPageModel.getMainclassGroupById(
        maintenance_id
      );

      if (!resutlMainClassGroup) {
        return {
          message: "Error model resutlMainClassGroup",
          status: false,
          error: 500,
        };
      }
      let mainClassFilter;
      resutlMainClassGroup = resutlMainClassGroup.map((mc_group) => {
        (mainClassFilter = resutlMainClass.filter((item) => {
          return mc_group.group_m == item.group_m;
        })),
          (mainClassFilter = mainClassFilter.map((item) => {
            delete item.group_m;
            return item;
          }));
        return {
          name:
            maintenance_id == 1
              ? mc_group.group_m == 1
                ? "H/W"
                : "S/W"
              : mc_group.group_m == 1
              ? "전산부분"
              : "일반부분",
          group_m:
            maintenance_id == 1
              ? mc_group.group_m == 1
                ? 1
                : 2
              : mc_group.group_m == 1
              ? 1
              : 2,
          data: mainClassFilter,
        };
      });

      return resutlMainClass
        ? resutlMainClassGroup
        : {
            message: "Error model getMaintenanceClassById",
            status: false,
            error: 500,
          };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error getMaintenanceClassById Sevice",
        status: false,
        error: 500,
      };
    }
  }

  async addLabelInMainclass(maintenance_id, maintenance_class_id, label_id) {
    try {
      const exist = await adminModel.checkExistLabelId(
        maintenance_id,
        label_id
      );

      if (exist) {
        if (exist.status == false) {
          return {
            message: exist.message,
            status: exist.status,
          };
        } else {
          const resultRegister = await adminModel.addLabelToMainClass(
            maintenance_class_id,
            label_id
          );

          if (!resultRegister) {
            return { message: "add Label fail", status: false, error: 500 };
          }
          const newMainClass = await adminModel.getNewMainClass(
            maintenance_class_id
          );
          if (!newMainClass) {
            return {
              message: "error getNewMainClass",
              status: false,
              error: 500,
            };
          }
          return {
            data: { newMainClass },
            message: "Update label in mainClass Successfully",
            status: true,
          };
        }
      } else {
        return { message: "Server error find ID", status: false, error: 500 };
      }
    } catch (error) {
      console.log(error);
      return {
        message: "Server error addLabelInMainclass",
        status: false,
        error: 500,
      };
    }
  }

  async getInforReport(data) {
    try {
      let accumulationRegisterYear =
        await adminModel.amountAccumulationRegister("year", data.year);
      let amountRequestCompletedYear = await adminModel.amountRequestCompleted(
        "year",
        data.year
      );
      let amountRequestProcessingYear =
        await adminModel.amountRequestProcessing("year", data.year);
      let amountRequestCompletedPercentYear =
        await adminModel.amountPerRequestCompleted("year", data.year);
      let accumulationRegisterMonth =
        await adminModel.amountAccumulationRegister("month", data.month);
      let amountRequestCompletedMonth = await adminModel.amountRequestCompleted(
        "month",
        data.month
      );
      let amountRequestProcessingMonth =
        await adminModel.amountRequestProcessing("month", data.month);
      let amountRequestCompletedPercentMonth =
        await adminModel.amountPerRequestCompleted("month", data.month);
      let mainType = await userPageModel.getMaintenanceType();
      const mainTypeChart = await Promise.all(
        mainType.map(async (itemMT) => {
          let group = await userPageModel.getMainclassGroupById(itemMT.id);
          group = await Promise.all(
            group.map(async (itemG) => {
              const chart = await adminModel.getInforChartByOption(
                itemMT.id,
                itemG.group_m,
                "month",
                data
              );
              let group_name = "";
              if (itemMT.id == 1 && itemG.group_m == 1) {
                group_name = "H/W";
              } else if (itemMT.id == 1 && itemG.group_m == 2) {
                group_name = "S/W";
              } else if (itemMT.id == 2 && itemG.group_m == 1) {
                group_name = "전산부분";
              } else if (itemMT.id == 2 && itemG.group_m == 2) {
                group_name = "일반부분";
              }
              return {
                group_name,
                group_m: itemG.group_m,
                chart,
              };
            })
          );
          return {
            ...itemMT,
            group,
          };
        })
      );

      // ////////////
      const mainTypeRequestNotComplete = await Promise.all(
        mainType.map(async (itemMT) => {
          let listRequest = await adminModel.getCountRequestNotCompleteOption(
            itemMT.id,
            "month",
            data
          );

          return {
            ...itemMT,
            listRequest,
          };
        })
      );

      const methodCount = await adminModel.getCountAllMethod(
        "month",
        data.month
      );
      const solutionCount = await adminModel.getCountAllSolution(
        "month",
        data.month
      );

      const solutionOnsite = solutionCount.filter((item) => {
        return item.type == 1;
      });

      const solutionOrderCompany = solutionCount.filter((item) => {
        return item.type == 2;
      });
      const listNewRequest = await adminModel.getListNewRequest();

      return {
        titleYear: [
          {
            title: "누적 등록건수",
            data: accumulationRegisterYear,
            count: accumulationRegisterYear.reduce((accumulator, item) => {
              return accumulator + item.countRequest;
            }, 0),
          },
          {
            title: "누적 처리완료",
            data: amountRequestCompletedYear,
            count: amountRequestCompletedYear.reduce((accumulator, item) => {
              return accumulator + item.countRequest;
            }, 0),
          },
          {
            title: "누적 진행중",
            data: amountRequestProcessingYear,
            count: amountRequestProcessingYear.reduce((accumulator, item) => {
              return accumulator + item.countRequest;
            }, 0),
          },
          {
            title: "처리율",
            data: amountRequestCompletedPercentYear,
            count: amountRequestCompletedPercentYear.reduce(
              (accumulator, item) => {
                return parseFloat(accumulator) + parseFloat(item.countRequest);
              },
              0
            ),
          },
        ],

        titleMonth: [
          {
            title: "등록건수",
            data: accumulationRegisterMonth,
            count: accumulationRegisterMonth.reduce((accumulator, item) => {
              return accumulator + item.countRequest;
            }, 0),
          },
          {
            title: "처리완료",
            data: amountRequestCompletedMonth,
            count: amountRequestCompletedMonth.reduce((accumulator, item) => {
              return accumulator + item.countRequest;
            }, 0),
          },
          {
            title: "진행중",
            data: amountRequestProcessingMonth,
            count: amountRequestProcessingMonth.reduce((accumulator, item) => {
              return accumulator + item.countRequest;
            }, 0),
          },
          {
            title: "처리율",
            data: amountRequestCompletedPercentMonth,
            count: amountRequestCompletedPercentMonth.reduce(
              (accumulator, item) => {
                return parseFloat(accumulator) + parseFloat(item.countRequest);
              },
              0
            ),
          },
        ],
        mainTypeChart,
        mainTypeRequestNotComplete,
        methodCount,
        solutionCount: {
          onsite: { name: "자체처리", data: solutionOnsite },
          ortherCompany: { ...solutionOrderCompany[0] },
        },

        listNewRequest,
      };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error getInforReport Sevice",
        status: false,
        error: 500,
      };
    }
  }

  async getInforReportDaily(data) {
    try {
      const datetime = data.year + "-" + data.month + "-" + data.day;
      // console.log(datetime);
      let accumulationRegisterMonth =
        await adminModel.amountAccumulationRegister("date", datetime);
      let amountRequestCompletedMonth = await adminModel.amountRequestCompleted(
        "date",
        datetime
      );
      let amountRequestProcessingMonth =
        await adminModel.amountRequestProcessing("date", datetime);
      let amountRequestCompletedPercentMonth =
        await adminModel.amountPerRequestCompleted("date", datetime);

      //
      let mainType = await userPageModel.getMaintenanceType();
      const mainTypeChart = await Promise.all(
        mainType.map(async (itemMT) => {
          let group = await userPageModel.getMainclassGroupById(itemMT.id);
          group = await Promise.all(
            group.map(async (itemG) => {
              const chart = await adminModel.getInforChartByOption(
                itemMT.id,
                itemG.group_m,
                "month",
                data
              );
              let group_name = "";
              if (itemMT.id == 1 && itemG.group_m == 1) {
                group_name = "H/W";
              } else if (itemMT.id == 1 && itemG.group_m == 2) {
                group_name = "S/W";
              } else if (itemMT.id == 2 && itemG.group_m == 1) {
                group_name = "전산부분";
              } else if (itemMT.id == 2 && itemG.group_m == 2) {
                group_name = "일반부분";
              }
              return {
                group_name,
                group_m: itemG.group_m,
                chart,
              };
            })
          );
          return {
            ...itemMT,
            group,
          };
        })
      );

      // ////////////
      const mainTypeRequestNotComplete = await Promise.all(
        mainType.map(async (itemMT) => {
          let listRequest = await adminModel.getCountRequestNotCompleteOption(
            itemMT.id,
            "month",
            data
          );

          return {
            ...itemMT,
            listRequest,
          };
        })
      );

      const methodCount = await adminModel.getCountAllMethod("date", datetime);
      const solutionCount = await adminModel.getCountAllSolution(
        "date",
        datetime
      );

      const solutionOnsite = solutionCount.filter((item) => {
        return item.type == 1;
      });

      const solutionOrderCompany = solutionCount.filter((item) => {
        return item.type == 2;
      });
      const listNewRequest = await adminModel.getListNewRequest();

      return {
        titleMonth: [
          {
            title: "등록건수",
            data: accumulationRegisterMonth,
            count: accumulationRegisterMonth.reduce((accumulator, item) => {
              return accumulator + item.countRequest;
            }, 0),
          },
          {
            title: "처리완료",
            data: amountRequestCompletedMonth,
            count: amountRequestCompletedMonth.reduce((accumulator, item) => {
              return accumulator + item.countRequest;
            }, 0),
          },
          {
            title: "진행중",
            data: amountRequestProcessingMonth,
            count: amountRequestProcessingMonth.reduce((accumulator, item) => {
              return accumulator + item.countRequest;
            }, 0),
          },
          {
            title: "처리율",
            data: amountRequestCompletedPercentMonth,
            count: amountRequestCompletedPercentMonth.reduce(
              (accumulator, item) => {
                return parseFloat(accumulator) + parseFloat(item.countRequest);
              },
              0
            ),
          },
        ],
        mainTypeChart,
        mainTypeRequestNotComplete,
        methodCount,
        solutionCount: {
          onsite: { name: "자체처리", data: solutionOnsite },
          ortherCompany: { ...solutionOrderCompany[0] },
        },

        listNewRequest,
      };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error getInforReport Sevice",
        status: false,
        error: 500,
      };
    }
  }
  async getInforReportWeek(data) {
    try {
      if (!data.week && !data.year) {
        //////

        function getDateWeek(date) {
          const currentDate = date ? date : new Date();
          const januaryFirst = new Date(currentDate.getFullYear(), 0, 1);
          const daysToNextMonday =
            januaryFirst.getDay() === 1 ? 0 : (7 - januaryFirst.getDay()) % 7;
          const nextMonday = new Date(
            currentDate.getFullYear(),
            0,
            januaryFirst.getDate() + daysToNextMonday
          );

          return currentDate < nextMonday
            ? 52
            : currentDate > nextMonday
            ? Math.ceil((currentDate - nextMonday) / (24 * 3600 * 1000) / 7)
            : 1;
        }
        const currentDate = new Date(Date.now());

        const weekNumber = getDateWeek(currentDate);

        // console.log("Week number of " + " is : " + weekNumber);

        data.week = weekNumber - 1;
        data.year = currentDate.getFullYear();

        // ////.
      }

      let month = new Date(Date.now()).getMonth() + 1;
      let accumulationRegisterMonth =
        await adminModel.amountAccumulationRegister("week", data.week);
      let amountRequestCompletedMonth = await adminModel.amountRequestCompleted(
        "week",
        data.week
      );
      let amountRequestProcessingMonth =
        await adminModel.amountRequestProcessing("week", data.week);
      let amountRequestCompletedPercentMonth =
        await adminModel.amountPerRequestCompleted("week", data.week);

      //
      let mainType = await userPageModel.getMaintenanceType();
      const mainTypeChart = await Promise.all(
        mainType.map(async (itemMT) => {
          let group = await userPageModel.getMainclassGroupById(itemMT.id);
          group = await Promise.all(
            group.map(async (itemG) => {
              const chart = await adminModel.getInforChartByOption(
                itemMT.id,
                itemG.group_m,
                "month",
                { month, year: data.year }
              );
              let group_name = "";
              if (itemMT.id == 1 && itemG.group_m == 1) {
                group_name = "H/W";
              } else if (itemMT.id == 1 && itemG.group_m == 2) {
                group_name = "S/W";
              } else if (itemMT.id == 2 && itemG.group_m == 1) {
                group_name = "전산부분";
              } else if (itemMT.id == 2 && itemG.group_m == 2) {
                group_name = "일반부분";
              }
              return {
                group_name,
                group_m: itemG.group_m,
                chart,
              };
            })
          );
          return {
            ...itemMT,
            group,
          };
        })
      );

      // ////////////
      const mainTypeRequestNotComplete = await Promise.all(
        mainType.map(async (itemMT) => {
          let listRequest = await adminModel.getCountRequestNotCompleteOption(
            itemMT.id,
            "month",
            { month, year: data.year }
          );

          return {
            ...itemMT,
            listRequest,
          };
        })
      );

      const methodCount = await adminModel.getCountAllMethod("week", data.week);
      const solutionCount = await adminModel.getCountAllSolution(
        "week",
        data.week
      );

      const solutionOnsite = solutionCount.filter((item) => {
        return item.type == 1;
      });

      const solutionOrderCompany = solutionCount.filter((item) => {
        return item.type == 2;
      });
      const listNewRequest = await adminModel.getListNewRequest();

      return {
        titleMonth: [
          {
            title: "등록건수",
            data: accumulationRegisterMonth,
            count: accumulationRegisterMonth.reduce((accumulator, item) => {
              return accumulator + item.countRequest;
            }, 0),
          },
          {
            title: "처리완료",
            data: amountRequestCompletedMonth,
            count: amountRequestCompletedMonth.reduce((accumulator, item) => {
              return accumulator + item.countRequest;
            }, 0),
          },
          {
            title: "진행중",
            data: amountRequestProcessingMonth,
            count: amountRequestProcessingMonth.reduce((accumulator, item) => {
              return accumulator + item.countRequest;
            }, 0),
          },
          {
            title: "처리율",
            data: amountRequestCompletedPercentMonth,
            count: amountRequestCompletedPercentMonth.reduce(
              (accumulator, item) => {
                return parseFloat(accumulator) + parseFloat(item.countRequest);
              },
              0
            ),
          },
        ],
        mainTypeChart,
        mainTypeRequestNotComplete,
        methodCount,
        solutionCount: {
          onsite: { name: "자체처리", data: solutionOnsite },
          ortherCompany: { ...solutionOrderCompany[0] },
        },

        listNewRequest,
      };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error getInforReport Sevice",
        status: false,
        error: 500,
      };
    }
  }
  async getInforReportMonthly(data) {
    try {
      if (!data.month && !data.year) {
        const currentTime = new Date(Date.now());
        data.month = currentTime.getMonth();
        data.year = currentTime.getFullYear();
        // console.log(data);
      }
      let accumulationRegisterMonth =
        await adminModel.amountAccumulationRegister("month", data.month);
      let amountRequestCompletedMonth = await adminModel.amountRequestCompleted(
        "month",
        data.month
      );
      let amountRequestProcessingMonth =
        await adminModel.amountRequestProcessing("month", data.month);
      let amountRequestCompletedPercentMonth =
        await adminModel.amountPerRequestCompleted("month", data.month);
      //

      let accumulationRegisterYear =
        await adminModel.amountAccumulationRegister("year", data.year);
      let amountRequestCompletedYear = await adminModel.amountRequestCompleted(
        "year",
        data.year
      );
      let amountRequestProcessingYear =
        await adminModel.amountRequestProcessing("year", data.year);
      let amountRequestCompletedPercentYear =
        await adminModel.amountPerRequestCompleted("year", data.year);

      //
      let mainType = await userPageModel.getMaintenanceType();
      const mainTypeChart = await Promise.all(
        mainType.map(async (itemMT) => {
          let group = await userPageModel.getMainclassGroupById(itemMT.id);
          group = await Promise.all(
            group.map(async (itemG) => {
              const chart = await adminModel.getInforChartByOption(
                itemMT.id,
                itemG.group_m,
                "month",
                data
              );
              let group_name = "";
              if (itemMT.id == 1 && itemG.group_m == 1) {
                group_name = "H/W";
              } else if (itemMT.id == 1 && itemG.group_m == 2) {
                group_name = "S/W";
              } else if (itemMT.id == 2 && itemG.group_m == 1) {
                group_name = "전산부분";
              } else if (itemMT.id == 2 && itemG.group_m == 2) {
                group_name = "일반부분";
              }
              return {
                group_name,
                group_m: itemG.group_m,
                chart,
              };
            })
          );
          return {
            ...itemMT,
            group,
          };
        })
      );

      // ////////////
      const mainTypeRequestNotComplete = await Promise.all(
        mainType.map(async (itemMT) => {
          let listRequest = await adminModel.getCountRequestNotCompleteOption(
            itemMT.id,
            "month",
            data
          );

          return {
            ...itemMT,
            listRequest,
          };
        })
      );

      const methodCount = await adminModel.getCountAllMethod(
        "month",
        data.month
      );
      const solutionCount = await adminModel.getCountAllSolution(
        "month",
        data.month
      );

      const solutionOnsite = solutionCount.filter((item) => {
        return item.type == 1;
      });

      const solutionOrderCompany = solutionCount.filter((item) => {
        return item.type == 2;
      });
      const listNewRequest = await adminModel.getListNewRequest();

      return {
        titleYear: [
          {
            title: "누적 등록건수",
            data: accumulationRegisterYear,
            count: accumulationRegisterYear.reduce((accumulator, item) => {
              return accumulator + item.countRequest;
            }, 0),
          },
          {
            title: "누적 처리완료",
            data: amountRequestCompletedYear,
            count: amountRequestCompletedYear.reduce((accumulator, item) => {
              return accumulator + item.countRequest;
            }, 0),
          },
          {
            title: "누적 진행중",
            data: amountRequestProcessingYear,
            count: amountRequestProcessingYear.reduce((accumulator, item) => {
              return accumulator + item.countRequest;
            }, 0),
          },
          {
            title: "처리율",
            data: amountRequestCompletedPercentYear,
            count: amountRequestCompletedPercentYear.reduce(
              (accumulator, item) => {
                return parseFloat(accumulator) + parseFloat(item.countRequest);
              },
              0
            ),
          },
        ],
        titleMonth: [
          {
            title: "등록건수",
            data: accumulationRegisterMonth,
            count: accumulationRegisterMonth.reduce((accumulator, item) => {
              return accumulator + item.countRequest;
            }, 0),
          },
          {
            title: "처리완료",
            data: amountRequestCompletedMonth,
            count: amountRequestCompletedMonth.reduce((accumulator, item) => {
              return accumulator + item.countRequest;
            }, 0),
          },
          {
            title: "진행중",
            data: amountRequestProcessingMonth,
            count: amountRequestProcessingMonth.reduce((accumulator, item) => {
              return accumulator + item.countRequest;
            }, 0),
          },
          {
            title: "처리율",
            data: amountRequestCompletedPercentMonth,
            count: amountRequestCompletedPercentMonth.reduce(
              (accumulator, item) => {
                return parseFloat(accumulator) + parseFloat(item.countRequest);
              },
              0
            ),
          },
        ],

        mainTypeChart,
        mainTypeRequestNotComplete,
        methodCount,
        solutionCount: {
          onsite: { name: "자체처리", data: solutionOnsite },
          ortherCompany: {
            solution_name: solutionOrderCompany[0].solution_name,
            type: solutionOrderCompany[0].type,
            count: solutionOrderCompany[0].count,
          },
        },

        listNewRequest,
      };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error getInforReportMonthly Sevice",
        status: false,
        error: 500,
      };
    }
  }
  async updateAdminInfor(user_id, data) {
    try {
      const userInfor = await userPageModel.getUserInfor(user_id);
      if (!userInfor) {
        return {
          message: "Id not found",
          status: false,
          error: "u_404",
        };
      }
      const resultUpdate = await adminModel.updateAdminInfor(user_id, data);
      return resultUpdate
        ? {
            message: "Update Admin infor success",
            status: true,
            error: 500,
          }
        : {
            message: "Error upadte Admin infor model",
            status: false,
            error: 500,
          };
    } catch (error) {
      console.log(error);
      return {
        message: "Error upadte Admin infor service",
        status: false,
        error: 500,
      };
    }
  }
}
module.exports = new adminPageService();
