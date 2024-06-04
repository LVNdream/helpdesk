const authModel = require("../models/authModel");
const adminModel = require("../models/adminModel");

const helperModel = require("../models/helperModel");
const userPageModel = require("../models/userPageModel");
const midService = require("./midService");

class userPageService {
  async getRequestList(data, page) {
    try {
      const resutl = await userPageModel.getRequestList(data.id, page);
      // console.log(resutl)
      const requestCount = await userPageModel.getUserRequestCount(data.id);

      return resutl
        ? { data: resutl, requestCount: parseInt(requestCount) }
        : { message: "Error model getRequestList", status: false, error: 500 };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error GetRequestList Sevice",
        status: false,
        error: 500,
      };
    }
  }
  async getRequestListBySearch(petitioner_id, option, text, status_id, page) {
    try {
      const resutl = await userPageModel.requestListBySearchText(
        petitioner_id,
        option,
        text,
        status_id,
        page
      );

      const requestCount = resutl.reduce((accumulator, element) => {
        return accumulator + 1;
      }, 0);

      return resutl
        ? { data: resutl, requestCount }
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
            const resutlMainClass = await userPageModel.getMaintenanceClassId(
              item.id
            );
            if (!resutlMainClass) {
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

  async getRegisterRequest(user_id) {
    try {
      const main_type = await userPageModel.getMaintenanceType();

      if (!main_type) {
        return {
          message: "Server error getMaintenanceType Model",
          status: false,
          error: 500,
        };
      }
      const inforUser = await authModel.findAccountById(user_id);
      if (!inforUser) {
        return {
          message: "Server error findAccountById Model",
          status: false,
          error: 500,
        };
      }

      return {
        id: inforUser.id,
        name: inforUser.name,
        affiliated_department: inforUser.affiliated_department,
        phone_number: inforUser.phone_number,
        position: inforUser.position,
        email: inforUser.email,
        main_type,
      };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error getRegisterRequest service",
        status: false,
        error: 500,
      };
    }
  }

  async updateUserInfor(data, user_id, role_id) {
    try {
      let resutlInfor;
      if (role_id == 4) {
        const resutl = await userPageModel.updateUserInfor(data, user_id);
        resutlInfor = await userPageModel.getUserInfor(user_id, role_id);
        if (!resutl) {
          return {
            messsage: "Update Fail!, Error model update",
            status: false,
            error: 500,
          };
        }
      } else if (role_id == 1 || role_id == 2) {
        const resutl = await helperModel.updateHelpdeskInfor(data, user_id);

        if (!resutl) {
          return {
            messsage: "Update Fail!, Error model update",
            status: false,
            error: 500,
          };
        }
        resutlInfor = await this.getUserInfor(user_id,role_id)
        // let resutlGetInfor = await helperModel.getHelpdeskInfor(user_id);
        // let main_type = await helperModel.getMaintenanceType();
        // main_type = main_type.map((item) => {
        //   let checked = false;
        //   item.id == role_id ? (checked = true) : (checked = false);
        //   delete item.id;
        //   return {
        //     ...item,
        //     checked,
        //   };
        // });
        // resutlInfor = { ...resutlGetInfor, main_type };
      }

      return resutlInfor
        ? { messsage: "Update Success!", status: true, resutlInfor }
        : {
            messsage: "Get infor fail",
            status: false,
            error: 500,
          };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error UpdateUser Sevice",
        status: false,
        error: 500,
      };
    }
  }

  async userRegisterRequest(data, files) {
    try {
      const resutlAddRequest = await userPageModel.registerRequest(data);
      if (!resutlAddRequest.insertId) {
        return {
          message: "Server error registerrequest Model",
          status: false,
          error: 500,
        };
      }
      const request_id = resutlAddRequest.insertId;
      const filelLength = files.length;
      // console.log(request_id)
      for (let i = 0; i < filelLength; i++) {
        const file = files[i];
        const resutl = await userPageModel.addRequestFile(
          request_id,
          file.filename
        );
        if (!resutl) {
          return {
            message: "Server error addRequestFile Model",
            status: false,
            error: 500,
          };
        }
      }

      const moveFile = await midService.moveFiles(files);
      if (!moveFile) {
        return {
          message: "Server error moveFile",
          status: false,
          error: 500,
        };
      }
      const dataAdd = await userPageModel.getRequestJustRegister(
        data.petitioner_id,
        request_id
      );
      return {
        message: "Add request successfully",
        status: true,
        error: 200,
        data: dataAdd,
      };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error userRegisterrequest Sevice",
        status: false,
        error: 500,
      };
    }
  }

  // updateRequest
  async updateRequest(request_id, data, files, arrayDelete) {
    try {
      // console.log(files, arrayDelete);
      const status_id = await userPageModel.getIdStatusByRequest(request_id);
      if (!status_id) {
        return {
          message: "Server error get status ID Model",
          status: false,
          error: 500,
        };
      }
      if (status_id > 2) {
        return {
          message: "Status not valid",
          status: false,
          error: 500,
        };
      }

      const resultUpdate = await userPageModel.updateRequest(request_id, data);
      if (!resultUpdate) {
        return {
          message: "Error updateRequest model",
          status: false,
          error: 500,
        };
      }
      const listDelete = arrayDelete.length;
      if (listDelete > 0) {
        for (let i = 0; i < listDelete; i++) {
          const file = arrayDelete[i];
          // console.log(file);
          const resutlDB = await userPageModel.deleteFile(file);
          if (!resutlDB) {
            return {
              message: "Server error Delete File Model",
              status: false,
              error: 500,
            };
          }
          const resultDeleleSever = await midService.deleteFile(file, "files");
          if (!resultDeleleSever) {
            return {
              message: "Server error Delete one File midService",
              status: false,
              error: 500,
            };
          }
        }
      }
      const fileLength = files.length;
      if (fileLength > 0) {
        for (let i = 0; i < fileLength; i++) {
          const file = files[i];
          const resutl = await userPageModel.addRequestFile(
            request_id,
            file.filename
          );
          if (!resutl) {
            return {
              message: "Server error addRequestFile Model",
              status: false,
              error: 500,
            };
          }
        }

        const moveFile = await midService.moveFiles(files);
        if (!moveFile) {
          return {
            message: "Server error moveFile",
            status: false,
            error: 500,
          };
        }
      }
      return {
        message: "Update request successfully",
        status: true,
        error: 200,
      };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error Update Request Sevice",
        status: false,
        error: 500,
      };
    }
  }

  async deleteRequest(user_id, request_id) {
    try {
      const status_id = await userPageModel.getIdStatusByRequest(request_id);

      if (!status_id) {
        return {
          message:
            "Server error get status_id by request model or reqeusr_id not exist",
          status: false,
          error: 500,
        };
      }
      const resutlRequest = await userPageModel.getRequestById(request_id);
      // console.log(resutlRequest);
      if (!resutlRequest) {
        return {
          message: "Server error get request by id model",
          status: false,
          error: 500,
        };
      }

      if (status_id > 3) {
        return {
          message: "Status id  in valid",
          status: false,
          error: 400,
        };
      }
      if (resutlRequest.petitioner_id != user_id) {
        return {
          message: "You not own request",
          status: false,
          error: 401,
        };
      }

      // xoa file
      let files = await userPageModel.getAllFileByRequest(request_id);
      files = files.map((file) => {
        return file.file_address;
      });

      const filesLength = files.length;

      if (filesLength > 0) {
        for (let i = 0; i < filesLength; i++) {
          const file = files[i];
          console.log(file);
          const resutlDB = await userPageModel.deleteFile(file);
          if (!resutlDB) {
            return {
              message: "Server error Delete File Model",
              status: false,
              error: 500,
            };
          }
          const resultDeleleSever = await midService.deleteFile(file, "files");
          if (!resultDeleleSever) {
            return {
              message: "Server error Delete one File midService",
              status: false,
              error: 500,
            };
          }
        }
      }

      //  xoa list_problem
      const deleteProblem = await userPageModel.deleteListProblem(request_id);

      if (!deleteProblem) {
        return {
          message: "Server error Delete list Problem midService",
          status: false,
          error: 500,
        };
      }
      // xoa request
      const resutl = await userPageModel.deleteRequest(user_id, request_id);

      return resutl
        ? { messsage: "Deleted Success!", status: true, request_id }
        : {
            messsage: "Delete Fail!, Error model delete",
            status: false,
            error: 500,
          };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error delete Sevice",
        status: false,
        error: 500,
      };
    }
  }
  async getUserInfor(user_id, role_id) {
    try {
      let resutl;
      if (role_id == 4) {
        resutl = await userPageModel.getUserInfor(user_id);
      }
      if (role_id == 1 || role_id == 2) {
        resutl = await helperModel.getHelpdeskInfor(user_id);
        let main_type = await helperModel.getMaintenanceType();
        main_type = main_type.map((item) => {
          let checked = false;
          item.id == role_id ? (checked = true) : (checked = false);
          delete item.id;
          return {
            ...item,
            checked,
          };
        });
        resutl = { ...resutl, main_type };
      }
      return resutl
        ? resutl
        : { message: "Error model getUserInfor", status: false, error: 500 };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error getUserInfor Sevice",
        status: false,
        error: 500,
      };
    }
  }

  async getStatus() {
    try {
      const resutl = await userPageModel.getStatus();

      return resutl
        ? resutl
        : { message: "Error model Get Status", status: false, error: 500 };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error Get Status Sevice",
        status: false,
        error: 500,
      };
    }
  }
}
module.exports = new userPageService();
