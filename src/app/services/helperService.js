const { restart } = require("nodemon");
const helperModel = require("../models/helperModel");
const userPageModel = require("../models/userPageModel");
const midService = require("./midService");

class helperPageService {
  async getRequestListByHelper(role_id, recipient_id, page) {
    try {
      const resutl = await helperModel.getRequestListByHelper(
        role_id,
        recipient_id,
        page
      );

      const requestCount = await helperModel.getHelperRequestCount(
        recipient_id,
        role_id
      );

      return resutl
        ? { data: resutl, requestCount: parseInt(requestCount) }
        : {
            message: "Error model getRequestListByHelper",
            status: false,
            error: 500,
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
  async acceptRequest(request_id, recipient_id) {
    try {
      const status_id = await userPageModel.getIdStatusByRequest(request_id);
      if (!status_id) {
        return {
          message: "Error model get status id by request",
          status: false,
          error: 500,
        };
      }
      const inforRequest = await userPageModel.getRequestById(request_id);
      if (!inforRequest) {
        return {
          message: "Error model get request by id",
          status: false,
          error: 500,
        };
      }

      let MT_Register;
      const listProblem_RQ = await userPageModel.getAllProblemByRequest_id(
        request_id
      );

      if (status_id == 1 || status_id == 2 || status_id == 3) {
        MT_Register = await midService.getMaintenanceType_checked(
          inforRequest.maintenance_id
        );
        const resultInfor = await userPageModel.getRequestConfirm_Register(
          request_id
        );

        if (
          (status_id == 2 || status_id == 3) &&
          resultInfor.recipient_id != recipient_id
        ) {
          return {
            message: "Recipient not valid",
            status: false,
            error: 401,
          };
        }
        if (status_id == 1) {
          const resultUpdateStatus = await helperModel.updateStatus_id(
            request_id,
            2
          );
          if (!resultUpdateStatus) {
            return {
              message: "Error model update status id",
              status: false,
              error: 500,
            };
          }
          const resultUpdateRecipient = await helperModel.updateRecipient_id(
            request_id,
            recipient_id
          );
          if (!resultUpdateRecipient) {
            return {
              message: "Error model update request recipient",
              status: false,
              error: 500,
            };
          }
          return {
            data: {
              infor_petitioner: {
                user_id: resultInfor.user_id,
                account: resultInfor.account,
                name: resultInfor.name,
                affiliated_department: resultInfor.affiliated_department,
                phone_number: resultInfor.phone_number,
                position: resultInfor.position,
                email: resultInfor.email,
              },
              id: resultInfor.id,
              title_request: resultInfor.title_request,
              content_request: resultInfor.content_request,
              maintenance_id: resultInfor.maintenance_id,
              method_name: resultInfor.method_name,
              solution_name: resultInfor.solution_name,
              created_at: resultInfor.created_at,
              listProblem_RQ,
              MT_Register,
              status_id: status_id + 1,
            },
            status: true,
          };
        }
        return {
          data: {
            infor_petitioner: {
              user_id: resultInfor.user_id,
              account: resultInfor.account,

              name: resultInfor.name,
              affiliated_department: resultInfor.affiliated_department,
              phone_number: resultInfor.phone_number,
              position: resultInfor.position,
              email: resultInfor.email,
            },
            id: resultInfor.id,
            title_request: resultInfor.title_request,
            content_request: resultInfor.content_request,
            maintenance_id: resultInfor.maintenance_id,
            method_name: resultInfor.method_name,
            solution_name: resultInfor.solution_name,
            created_at: resultInfor.created_at,
            listProblem_RQ,
            MT_Register,
            status_id: status_id,
          },
          status: true,
        };
      } else if (status_id == 4 || status_id == 5) {
        const resultInfor = await userPageModel.getRequestCompleted(request_id);

        // lay ra maintenance

        const MT_Register = await midService.getMaintenanceType_checked(
          inforRequest.maintenance_id
        );

        const resutlProcessingDetail =
          await userPageModel.getMaintenanceClassRequest(inforRequest.id);

        const listMT_detail = await Promise.all(
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

        const files = await userPageModel.getAllFileByRequest(inforRequest.id);
        if (!files) {
          return {
            message: "Error get file by request",
            status: false,
            error: 500,
          };
        }

        //

        if (resultInfor.r_id != recipient_id) {
          return {
            message: "Recipient not valid",
            status: false,
            error: 401,
          };
        }

        return {
          data: {
            id: resultInfor.id,
            title_request: resultInfor.title_request,
            content_request: resultInfor.content_request,
            created_at: resultInfor.created_at,
            processing_content_problem: resultInfor.processing_content_problem,
            solution_name: resultInfor.solution_name,
            method_name: resultInfor.method_name,

            infor_petitioner: {
              user_id: resultInfor.petitioner_id,
              name: resultInfor.p_name,
              account: resultInfor.p_account,

              affiliated_department: resultInfor.p_affiliated_department,
              phone_number: resultInfor.p_phone_number,
              position: resultInfor.p_position,
              email: resultInfor.p_email,
            },
            infor_recipient: {
              user_id: resultInfor.r_id,
              name: resultInfor.r_name,
              account: resultInfor.r_account,
              affiliated_department: resultInfor.r_affiliated_department,
              phone_number: resultInfor.r_phone_number,
              position: resultInfor.r_position,
              email: resultInfor.r_email,
            },
            MT_Register: listMT_detail,
            listProblem_RQ,
            files,
            status_id,
          },
          status: true,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        message: "Server error accept Request Sevice",
        status: false,
        error: 500,
      };
    }
  }

  async getRequestListBySearch(
    recipient_id,
    role_id,
    option,
    text,
    status_id,
    page
  ) {
    try {
      const resutl = await helperModel.requestListBySearchText(
        recipient_id,
        role_id,
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

  // updateHelpdeskInfor
  async updateHelpdeskInfor(data, user_id) {
    try {
      const resutl = await helperModel.updateHelpdeskInfor(data, user_id);

      if (!resutl) {
        return {
          messsage: "Update Fail!, Error model update",
          status: false,
          error: 500,
        };
      }

      const resutlInfor = await userPageModel.getUserInfor(user_id);

      return resutlInfor
        ? { messsage: "Update help desk Success!", status: true, resutlInfor }
        : {
            messsage: "Get infor helpdesk fail",
            status: false,
            error: 500,
          };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error updateHelpdeskInfor Sevice",
        status: false,
        error: 500,
      };
    }
  }

  async saveStatusProcessing(request_id, recipient_id, listProblem) {
    try {
      const resutlRQ = await userPageModel.getRequestById(request_id);
      if (resutlRQ.recipient_id != recipient_id) {
        return {
          message: "Recipient not valid",
          status: false,
          error: 401,
        };
      }
      if (resutlRQ.status_id == 2) {
        if (listProblem.length > 0) {
          // them van de vao database
          const problemsLength = listProblem.length;
          for (let i = 0; i < problemsLength; i++) {
            const problem = listProblem[i];
            const resultAddListProblem = await helperModel.addListProblem(
              request_id,
              problem
            );
            if (!resultAddListProblem) {
              return {
                message: "Error add request problem model",
                status: false,
                error: 500,
              };
            }
          }

          //updateStatus
          const resultUpdateStatus = await helperModel.updateStatus_id(
            request_id,
            3
          );
          if (!resultUpdateStatus) {
            return {
              message: "Error update request status model",
              status: false,
              error: 500,
            };
          }
          return {
            message: "Save status processing success",
            status: true,
          };
        }
      }
    } catch (error) {
      console.log(error);
      return {
        message: "Server error save request status processing Sevice",
        status: false,
        error: 500,
      };
    }
  }

  async addListProblem(request_id, recipient_id, listProblem) {
    try {
      const resultRQ = await userPageModel.getRequestById(request_id);
      if (resultRQ.recipient_id != recipient_id) {
        return {
          message: "Recipient not valid",
          status: false,
          error: 401,
        };
      }

      const lengthProblems = listProblem.length;
      for (let i = 0; i < lengthProblems; i++) {
        const problemData = listProblem[i];
        const resultAdd = await helperModel.addListProblem(
          request_id,
          problemData
        );
        if (!resultAdd) {
          return {
            message: "Error add request problem model",
            status: false,
            error: 500,
          };
        }
      }
      let data;

      if (resultRQ.status_id == 2) {
        const resultUpdateStatus = await helperModel.updateStatus_id(
          request_id,
          3
        );
        // console.log(resultUpdateStatus)
        if (!resultUpdateStatus) {
          return {
            message: "Error update request status model",
            status: false,
            error: 500,
          };
        }
        data = { request_id, status_id: 3 };
      }
      return {
        data,
        message: "Add problem success",
        status: true,
      };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error add list request problem Sevice",
        status: false,
        error: 500,
      };
    }
  }

  async updateProblem(
    request_id,
    recipient_id,
    problem_id,
    problem,
    updated_at
  ) {
    try {
      const resultRQ = await userPageModel.getRequestById(request_id);
      if (resultRQ.recipient_id != recipient_id) {
        return {
          message: "Recipient not valid",
          status: false,
          error: 401,
        };
      }

      const resultUpdate = await helperModel.updateProblem(
        problem_id,
        problem,
        updated_at
      );
      if (!resultUpdate) {
        return {
          message: "Error update request problem model",
          status: false,
          error: 500,
        };
      }

      return {
        data: {
          request_id,
          problem_id,
          problem,
          updated_at,
        },
        message: "update problem success",
        status: true,
      };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error update list request problem Sevice",
        status: false,
        error: 500,
      };
    }
  }

  async deleteProblem(request_id, recipient_id, problem_id) {
    try {
      const resultRQ = await userPageModel.getRequestById(request_id);
      if (resultRQ.recipient_id != recipient_id) {
        return {
          message: "Recipient not valid",
          status: false,
          error: 401,
        };
      }

      const resultDelete = await helperModel.deleteProblem(problem_id);
      if (!resultDelete) {
        return {
          message: "Error Delete request problem model",
          status: false,
          error: 500,
        };
      }
      const listProblem = await userPageModel.getAllProblemByRequest_id(
        request_id
      );
      if (!listProblem) {
        return {
          message: "Error get all problem model",
          status: false,
          error: 500,
        };
      }
      let data;

      if (listProblem.length == 0) {
        const resutlUpdateStatus = await helperModel.updateStatus_id(
          request_id,
          2
        );
        if (!resutlUpdateStatus) {
          return {
            message: "Error update status model",
            status: false,
            error: 500,
          };
        }
        data = {
          request_id,
          status_id: 2,
        };
      }
      return {
        data,

        message: "Delete problem success",
        status: true,
        problem_id,
      };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error Delet list request problem Sevice",
        status: false,
        error: 500,
      };
    }
  }

  async verifyCompleted(request_id, recipient_id, data) {
    try {
      const resultRQ = await userPageModel.getRequestById(request_id);
      if (resultRQ.recipient_id != recipient_id) {
        return {
          message: "Recipient not valid",
          status: false,
          error: 401,
        };
      }
      const dataUpdate = {
        processing_content_problem: data.processing_content_problem,
        solution_id: data.solution_id,

        status_id: data.status_id,
      };

      // console.log(dataUpdate);
      const resultUpdate = await helperModel.addDataTocompleted(
        request_id,
        dataUpdate
      );
      if (!resultUpdate) {
        return {
          message: "Error Update data to completed",
          status: false,
          error: 500,
        };
      }
      const listProcessing = data.listProcessing;

      const listProcessLength = listProcessing.length;
      // add data
      for (let i = 0; i < listProcessLength; i++) {
        const label_id = listProcessing[i];
        const resultAddprocess = await helperModel.addProcessingDetail(
          request_id,
          label_id
        );
        if (!resultAddprocess) {
          return {
            message: "Error add process detai;",
            status: false,
            error: 500,
          };
        }
      }
      const inforUpdate = await userPageModel.getNewRequest(request_id);
      if (!inforUpdate) {
        return {
          message: "Error get getNewRequest model",
          status: false,
          error: 500,
        };
      }
      return {
        data: inforUpdate,
        message: "Verify Completed success",
        status: true,
      };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error update request to completed Sevice",
        status: false,
        error: 500,
      };
    }
  }

  async getFiles(request_id) {
    try {
      const resutl = await userPageModel.getAllFileByRequest(request_id);

      return resutl
        ? resutl
        : {
            message: "Error model get Request Files",
            status: false,
            error: 500,
          };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error get request Files Sevice",
        status: false,
        error: 500,
      };
    }
  }
  async getInforComplted(recipient_id, request_id, role_id) {
    try {
      //  get Infor
      const infor_recipient = await helperModel.getHelpdeskInfor(recipient_id);
      if (!infor_recipient) {
        return {
          message: "Error model get infor User",
          status: false,
          error: 500,
        };
      }

      // get ìnor request
      let inforRequest;
      if (request_id) {
        const result = await userPageModel.getRequestById(request_id);
        if (!result) {
          return {
            message: "Error model get infor request",
            status: false,
            error: 500,
          };
        }
        inforRequest = result;
      }
      //
      //
      // get method
      let methods;
      if (!request_id) {
        methods = await helperModel.getMethod();
        if (!methods) {
          return {
            message: "Error model get Method",
            status: false,
            error: 500,
          };
        }
      }
      //
      // / get soltion
      const solutions = await helperModel.getSolution();
      if (!solutions) {
        return {
          message: "Error model get solutions",
          status: false,
          error: 500,
        };
      }
      //
      // get status
      let status = await helperModel.getStatus();
      if (!status) {
        return {
          message: "Error model get status",
          status: false,
          error: 500,
        };
      }
      if (request_id) {
        status = status.filter((item) => {
          return item.id == 4 || item.id == 5;
        });
      } else {
        status = status.filter((item) => {
          return item.id == 2 || item.id == 4;
        });
      }
      //
      let main_type;
      if (inforRequest) {
        main_type = await midService.getMaintenanceType_checked(
          inforRequest.maintenance_id
        );
      } else {
        if (role_id == 5) {
          main_type = await midService.getMaintenanceType_checked();
          main_type = main_type.map((item) => {
            return { ...item, checked: true };
          });
        } else {
          main_type = await midService.getMaintenanceType_checked(role_id);
        }
      }

      if (!main_type) {
        return {
          message: "Error model get Maintenance Type",
          status: false,
          error: 500,
        };
      }
      main_type = await Promise.all(
        main_type.map(async (mainType) => {
          let mainClass = await userPageModel.getMaintenanceClassId(
            mainType.id
          );

          if (mainType.id == 1) {
            let classFilterHW = mainClass.filter((item) => {
              return item.group_m == 1;
            });
            classFilterHW = classFilterHW.map((item) => {
              return { label_id: item.label_id, label_name: item.label_name };
            });
            let classFilterSW = mainClass.filter((item) => {
              return item.group_m == 2;
            });
            classFilterSW = classFilterSW.map((item) => {
              return { label_id: item.label_id, label_name: item.label_name };
            });
            return {
              ...mainType,
              group: [
                { name: "H/W", data: classFilterHW },
                { name: "S/W", data: classFilterSW },
              ],
            };
          }
          if (mainType.id == 2) {
            let classFilter1 = mainClass.filter((item) => {
              return item.group_m == 1;
            });
            classFilter1 = classFilter1.map((item) => {
              return { label_id: item.label_id, label_name: item.label_name };
            });
            let classFilter2 = mainClass.filter((item) => {
              return item.group_m == 2;
            });
            classFilter2 = classFilter2.map((item) => {
              return { label_id: item.label_id, label_name: item.label_name };
            });
            return {
              ...mainType,
              group: [
                { name: "전산부분", data: classFilter1 },
                { name: "일반부분", data: classFilter2 },
              ],
            };
          }
        })
      );
      let files = [];
      if (request_id) {
        files = await userPageModel.getAllFileByRequest(request_id);
      }
      // console.log(request_id, files);

      return {
        main_type,
        methods: methods ? methods : false,
        solutions,
        status,
        infor_recipient,
        files,
      };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error get maintenance type Sevice",
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
      if (resutlRequest.recipient_id != user_id) {
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

      //  xoa list_problem
      const listProblem = await userPageModel.getAllProblemByRequest_id(
        request_id
      );
      if (listProblem.length > 0) {
        const deleteProblem = await userPageModel.deleteListProblem(request_id);

        if (!deleteProblem) {
          return {
            message: "Server error Delete list Problem midService",
            status: false,
            error: 500,
          };
        }
      }
      // ///

      let data;
      data = await userPageModel.requestToOrther(user_id, page);
      if (!data) {
        return {
          messsage: "Error model requestToOrther",
          status: false,
          error: 500,
        };
      }

      // xoa request
      const resutl = await helperModel.deleteRequest(user_id, request_id);

      return resutl
        ? {
            messsage: "Deleted Success!",
            status: true,
            request_id,
            data: data,
          }
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

  async getAllUser(page) {
    try {
      let users = await helperModel.getAllUser(page);
      if (!users) {
        return {
          message: "Error in get users model",
          status: false,
          error: 500,
        };
      }
      let userCount = await helperModel.getUserCount();

      return { data: users, userCount: userCount };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error get maintenance type Sevice",
        status: false,
        error: 500,
      };
    }
  }

  async getUserById(user_id) {
    try {
      let user = await userPageModel.getUserInfor(user_id);
      if (!user) {
        return {
          message: "Error in get users infor model",
          status: false,
          error: 500,
        };
      }
      delete user.phone_number;
      delete user.leveluser;

      return user;
    } catch (error) {
      console.log(error);
      return {
        message: "Server error get maintenance type Sevice",
        status: false,
        error: 500,
      };
    }
  }

  async helperSearchUser(option, text, page) {
    try {
      const resutl = await helperModel.helperSearchUser(option, text, page);

      return resutl
        ? {
            data: resutl.listFilter,
            requestCount: parseInt(resutl.requestCount),
          }
        : {
            message: "Error model helperSearchUser",
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
  async addRequestCompleted(infor_user, data, files) {
    try {
      // console.log( data);
      const dataRequest = {
        title_request: data.title_request,
        content_request: data.content_request,
        //

        maintenance_id: data.maintenance_id,

        //
        petitioner_id: data.petitioner_id,
        recipient_id: infor_user.id,
        solution_id: data.solution_id,
        status_id: data.status_id,
        processing_content_problem: data.processing_content_problem,
        timeRequest: data.timeRequest,
        method_id: data.method_id,
      };
      // console.log(dataRequest)
      // add request
      const resultAddRQ = await helperModel.addRequestCompelted(dataRequest);
      if (!resultAddRQ) {
        return {
          message: "Server error add request completed model",
          status: false,
          error: 500,
        };
      }
      const request_id = resultAddRQ.insertId;

      //processing detail
      const listProcessing = data.listProcessing;

      const listProcessLength = listProcessing.length;
      // add data
      if (data.status_id == 4) {
        for (let i = 0; i < listProcessLength; i++) {
          const label_id = listProcessing[i];
          const resultAddprocess = await helperModel.addProcessingDetail(
            request_id,
            label_id
          );

          if (!resultAddprocess) {
            console.log(infor_user.id, request_id);
            const deleteRequest = await helperModel.helperDeleteRequest(
              infor_user.id,
              request_id
            );
            if (!deleteRequest) {
              return {
                message: "Error deleteRequest;",
                status: false,
                error: 500,
              };
            }
            return {
              message: "Error add process detai11;",
              status: false,
              error: 500,
            };
          }
        }
      }

      // add file

      const filelLength = files.length;
      for (let i = 0; i < filelLength; i++) {
        const file = files[i];
        const resutl = await userPageModel.addRequestFile(
          request_id,
          file.filename
        );
        if (!resutl) {
          const deleteProcessDetail =
            await helperModel.deleteListProcessByRequest(request_id);
          if (!deleteProcessDetail) {
            return {
              message: "Error deleteProcessDetail;",
              status: false,
              error: 500,
            };
          }
          const deleteRequest = await userPageModel.deleteRequest(
            infor_user.id,
            request_id
          );
          if (!deleteRequest) {
            return {
              message: "Error deleteRequest;",
              status: false,
              error: 500,
            };
          }
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

      let inforNewRequest = await userPageModel.getNewRequest(request_id);

      return {
        data: { ...inforNewRequest },
        message: "Register request completed success",
        status: true,
      };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error addRequestCompleted Sevice",
        status: false,
        error: 500,
      };
    }
  }
}
module.exports = new helperPageService();
