const authModel = require("../models/authModel");
const userPageModel = require("../models/userPageModel");
const midService = require("./midService");

class userPageService {
  async getRequestList(data) {
    try {
      const resutl = await userPageModel.getRequestList(data.id);

      return resutl
        ? resutl
        : { message: "Error model getRequestList", status: false, error: 501 };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error GetRequestList Sevice",
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

        return resutlConfirm_Register
          ? {
              ...resutlConfirm_Register,
              MT_Register,
              status_id,
              listProblem_RQ,
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
                if (itemMC.id == itemPD.class_id) {
                  checked = true;
                }
              });
              return { ...itemMC, checked };
            });
            if (item.id == 1) {
              const maintenanceClass_HW = maintenanceClass.filter((itemMC) => {
                return itemMC.group_m == 1;
              });
              const maintenanceClass_SW = maintenanceClass.filter((itemMC) => {
                return itemMC.group_m == 2;
              });
              return {
                ...item,
                maintenanceClass: [
                  { group_m: 1, name: "HardWare", maintenanceClass_HW },
                  { group_m: 2, name: "SoftWare", maintenanceClass_SW },
                ],
              };
            } else if (item.id == 2) {
              const maintenanceClass_HareDrive = maintenanceClass.filter(
                (itemMC) => {
                  return itemMC.group_m == 1;
                }
              );
              const maintenanceClass_GeneralMain = maintenanceClass.filter(
                (itemMC) => {
                  return itemMC.group_m == 2;
                }
              );
              return {
                ...item,
                maintenanceClass: [
                  { group_m: 1, name: "HardDive", maintenanceClass_HareDrive },
                  {
                    group_m: 2,
                    name: "GeneralMain",
                    maintenanceClass_GeneralMain,
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

        return resutlComplete_AddProblem
          ? {
              id: resutlComplete_AddProblem.id,
              title_request: resutlComplete_AddProblem.title_request,
              content_request: resutlComplete_AddProblem.content_request,
              created_at: resutlComplete_AddProblem.created_at,
              processing_content_problem:
                resutlComplete_AddProblem.processing_content_problem,
              solution_name: resutlComplete_AddProblem.solution_name,
              infor_petitioner: {
                p_id: resutlComplete_AddProblem.petitioner_id,
                p_name: resutlComplete_AddProblem.p_name,
                p_affiliated_department:
                  resutlComplete_AddProblem.p_affiliated_department,
                p_phone_number: resutlComplete_AddProblem.p_phone_number,
                p_position: resutlComplete_AddProblem.p_position,
                p_email: resutlComplete_AddProblem.p_email,
              },
              infor_recipient: {
                r_id: resutlComplete_AddProblem.r_id,
                r_name: resutlComplete_AddProblem.r_name,
                r_affiliated_department:
                  resutlComplete_AddProblem.r_affiliated_department,
                r_phone_number: resutlComplete_AddProblem.r_phone_number,
                r_position: resutlComplete_AddProblem.r_position,
                r_email: resutlComplete_AddProblem.r_email,
              },
              MT_Register: final_MT,
              status_id,
              listProblem_RQ,
            }
          : {
              message: "Error model getRequestConfirm_Register",
              status: false,
              error: 501,
            };
      }
      // switch (status_id) {
      //   // case 1:
      //   //   console.log("13jjjj1231");
      //   //   const resutlRegister = await userPageModel.getRequestRegister(id);

      //   //   const MT_Register = await midService.getMaintenanceType_checked(
      //   //     resutlRegister.maintenance_id
      //   //   );

      //   //   delete resutlRegister.maintenance_id;
      //   //   return resutlRegister
      //   //     ? {
      //   //         ...resutlRegister,
      //   //         MT_Register,
      //   //         status_id: status_id,
      //   //       }
      //   //     : {
      //   //         message: "Error model getRequestRegister",
      //   //         status: false,
      //   //         error: 500,
      //   //       };
      //   // case 0:
      //   //   const resutlConfirm = await userPageModel.getRequestConfirm(id);
      //   //   const MT_Confirm = await midService.getMaintenanceType_checked(
      //   //     resutlConfirm.maintenance_id
      //   //   );
      //   //   const listProblem_RQ_register =
      //   //     await userPageModel.getAllProblemByRequest_id(resutlConfirm.id);
      //   //   delete resutlConfirm.maintenance_id;
      //   //   return resutlConfirm
      //   //     ? {
      //   //         ...resutlConfirm,
      //   //         MT_Confirm,
      //   //         listProblem: listProblem_RQ_register,

      //   //         status_id: resutlConfirm.status_id,
      //   //       }
      //   //     : {
      //   //         message: "Error model getRequestConfirm",
      //   //         status: false,
      //   //         error: 500,
      //   //       };

      //   // case 3:
      //   //   const resutlProcessing = await userPageModel.getRequestProcessing(id);
      //   //   if (!resutlProcessing) {
      //   //     return {
      //   //       message: "Request detail status processing not found",
      //   //       status: false,
      //   //       error: 404,
      //   //     };
      //   //   }
      //   //   const listProblem_RQ_processing =
      //   //     await userPageModel.getAllProblemByRequest_id(resutlProcessing.id);
      //   //   //

      //   //   const MT_processing = await midService.getMaintenanceType_checked(
      //   //     resutlProcessing.maintenance_id
      //   //   );
      //   //   console.log(resutlProcessing.maintenance_id);

      //   //   if (resutlProcessing.maintenace_id && resutlProcessing.id) {
      //   //     const resutlMainClass = await userPageModel.getMaintenanceClassId(
      //   //       resutlProcessing.maintenace_id
      //   //     );

      //   //     const resutlProcessingDetail =
      //   //       await userPageModel.getMaintenanceClassRequest(
      //   //         resutlProcessing.id
      //   //       );
      //   //     if (!resutlMainClass) {
      //   //       return {
      //   //         message: "Mainclass not found",
      //   //         status: false,
      //   //         error: 404,
      //   //       };
      //   //     }
      //   //     if (!resutlProcessingDetail) {
      //   //       return {
      //   //         message: "ProcessingDetail not found",
      //   //         status: false,
      //   //         error: 404,
      //   //       };
      //   //     }
      //   //     const maintenanceClass = resutlMainClass.map((itemMC) => {
      //   //       let checked = false;
      //   //       resutlProcessingDetail.forEach((itemPD) => {
      //   //         if (itemMC.id == itemPD.class_id) {
      //   //           checked = true;
      //   //         }
      //   //       });
      //   //       return { ...itemMC, checked };
      //   //     });
      //   //     const finalResutl = {
      //   //       ...resutlProcessing,
      //   //       listProblem: listProblem_RQ_processing,
      //   //       maintenanceClass,
      //   //     };
      //   //     return finalResutl;
      //   //   }
      //   // case 4:
      //   //   const resutlCompleted = await userPageModel.getRequestCompleted(id);
      //   //   if (!resutlCompleted) {
      //   //     return {
      //   //       message: "Error server get request_complete detail",
      //   //       status: false,
      //   //       error: 500,
      //   //     };
      //   //   }
      //   //   if (resutlCompleted.maintenace_id && resutlCompleted.id) {
      //   //     const resutlMainClass = await userPageModel.getMaintenanceClassId(
      //   //       resutlCompleted.maintenace_id
      //   //     );

      //   //     const resutlProcessingDetail =
      //   //       await userPageModel.getMaintenanceClassRequest(
      //   //         resutlCompleted.id
      //   //       );
      //   //     if (!resutlMainClass) {
      //   //       return {
      //   //         message: "Mainclass not found",
      //   //         status: false,
      //   //         error: 404,
      //   //       };
      //   //     }
      //   //     if (!resutlProcessingDetail) {
      //   //       return {
      //   //         message: "ProcessingDetail not found",
      //   //         status: false,
      //   //         error: 404,
      //   //       };
      //   //     }
      //   //     const maintenanceClass = resutlMainClass.map((itemMC) => {
      //   //       let checked = false;
      //   //       resutlProcessingDetail.forEach((itemPD) => {
      //   //         if (itemMC.id == itemPD.class_id) {
      //   //           checked = true;
      //   //         }
      //   //       });
      //   //       return { ...itemMC, checked };
      //   //     });
      //   //     const finalResutl = {
      //   //       ...resutlCompleted,
      //   //       maintenanceClass,
      //   //     };
      //   //     return finalResutl;
      //   //   }
      //   default:
      //     break;
      // }
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

  async updateUserInfor(data, user_id) {
    try {
      const resutl = await userPageModel.updateUserInfor(data, user_id);

      return resutl
        ? { messsage: "Update Success!", status: true }
        : {
            messsage: "Update Fail!, Error model update",
            status: false,
            error: 501,
          };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error UpdateUser Sevice",
        status: false,
        error: 501,
      };
    }
  }
}
module.exports = new userPageService();
