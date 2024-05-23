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

      const requestCount = await helperModel.getHelperRequestCount(recipient_id,role_id);

      return resutl
        ? { data: resutl, requestCount:parseInt(requestCount) }
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
  async acceptRequest(request_id, recipient_id) {
    try {
      const status_id = await userPageModel.getIdStatusByRequest(request_id);
      if (!status_id) {
        return {
          message: "Error model get status id by request",
          status: false,
          error: 501,
        };
      }
      const MT_Register = await midService.getMaintenanceType_checked(
        request_id
      );
      const listProblem_RQ = await userPageModel.getAllProblemByRequest_id(
        request_id
      );

      if (status_id == 1 || status_id == 2 || status_id == 3) {
        const resultInfor = await userPageModel.getRequestConfirm_Register(
          request_id
        );
        console.log(resultInfor.recipient_id, recipient_id);
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
              error: 501,
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
              error: 501,
            };
          }
          return {
            ...resultInfor,
            listProblem_RQ,
            MT_Register,
            status_id: status_id + 1,
          };
        }
        return {
          ...resultInfor,
          listProblem_RQ,
          MT_Register,
          status_id: status_id,
        };
      } else if (status_id == 4 || status_id == 5) {
        const resultInfor = await userPageModel.getRequestCompleted(request_id);

        if (resultInfor.recipient_id != recipient_id) {
          return {
            message: "Recipient not valid",
            status: false,
            error: 401,
          };
        }

        return {
          id: resultInfor.id,
          title_request: resultInfor.title_request,
          content_request: resultInfor.content_request,
          created_at: resultInfor.created_at,
          processing_content_problem: resultInfor.processing_content_problem,
          solution_name: resultInfor.solution_name,
          method_name: resultInfor.method_name,

          infor_petitioner: {
            p_id: resultInfor.petitioner_id,
            p_name: resultInfor.p_name,
            p_affiliated_department: resultInfor.p_affiliated_department,
            p_phone_number: resultInfor.p_phone_number,
            p_position: resultInfor.p_position,
            p_email: resultInfor.p_email,
          },
          infor_recipient: {
            r_id: resultInfor.r_id,
            r_name: resultInfor.r_name,
            r_affiliated_department: resultInfor.r_affiliated_department,
            r_phone_number: resultInfor.r_phone_number,
            r_position: resultInfor.r_position,
            r_email: resultInfor.r_email,
          },
          MT_Register,
          listProblem_RQ,
          status_id,
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
                error: 501,
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
              error: 501,
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
        const problem = listProblem[i];
        const resultAdd = await helperModel.addListProblem(request_id, problem);
        if (!resultAdd) {
          return {
            message: "Error add request problem model",
            status: false,
            error: 501,
          };
        }
      }
      if (resultRQ.status_id == 2) {
        const resultUpdateStatus = await helperModel.updateStatus_id(
          resultRQ.request_id,
          3
        );
        if (!resultUpdateStatus) {
          return {
            message: "Error update request status model",
            status: false,
            error: 501,
          };
        }
      }
      return {
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

  async updateProblem(request_id, recipient_id, problem_id, problem) {
    try {
      const resultRQ = await userPageModel.getRequestById(request_id);
      if (resultRQ.recipient_id != recipient_id) {
        return {
          message: "Recipient not valid",
          status: false,
          error: 401,
        };
      }

      const resultUpdate = await helperModel.updateProblem(problem_id, problem);
      if (!resultUpdate) {
        return {
          message: "Error update request problem model",
          status: false,
          error: 501,
        };
      }

      return {
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
          error: 501,
        };
      }
      const listProblem = await userPageModel.getAllProblemByRequest_id(
        request_id
      );
      if (!listProblem) {
        return {
          message: "Error get all problem model",
          status: false,
          error: 501,
        };
      }
      if (listProblem.length == 0) {
        const resutlUpdateStatus = await helperModel.updateStatus_id(
          request_id,
          2
        );
        if (!resutlUpdateStatus) {
          return {
            message: "Error update status model",
            status: false,
            error: 501,
          };
        }
      }
      return {
        message: "Delete problem success",
        status: true,
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

      console.log(dataUpdate);
      const resultUpdate = await helperModel.addDataTocompleted(
        request_id,
        dataUpdate
      );
      if (!resultUpdate) {
        return {
          message: "Error Update data to completed",
          status: false,
          error: 501,
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
            error: 501,
          };
        }
      }
      return {
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
            error: 501,
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
  async getInforComplted(recipient_id) {
    try {
      //  get Infor
      const infor_recipient = await userPageModel.getUserInfor(recipient_id);
      if (!infor_recipient) {
        return {
          message: "Error model get infor User",
          status: false,
          error: 501,
        };
      }
      //
      // get method
      const methods = await helperModel.getMethod();
      if (!methods) {
        return {
          message: "Error model get Method",
          status: false,
          error: 501,
        };
      }
      //
      // / get soltion
      const solutions = await helperModel.getSolution();
      if (!solutions) {
        return {
          message: "Error model get solutions",
          status: false,
          error: 501,
        };
      }
      //
      // get status
      const status = await helperModel.getStatus();
      if (!status) {
        return {
          message: "Error model get status",
          status: false,
          error: 501,
        };
      }
      //
      let main_type = await helperModel.getMaintenanceType();

      if (!main_type) {
        return {
          message: "Error model get Maintenance Type",
          status: false,
          error: 501,
        };
      }
      main_type = await Promise.all(
        main_type.map(async (mainType) => {
          let mainClass = await userPageModel.getMaintenanceClassId(
            mainType.id
          );
          mainClass = mainClass.map((item) => {
            return {
              label_id: item.label_id,
              label_name: item.label_name,
            };
          });
          return {
            ...mainType,
            mainClass,
          };
        })
      );
      // console.log(main_type);
      return { main_type, methods, solutions, status, infor_recipient };
    } catch (error) {
      console.log(error);
      return {
        message: "Server error get maintenance type Sevice",
        status: false,
        error: 500,
      };
    }
  }

  async getAllUser() {
    try {
      let users = await helperModel.getAllUser();
      if (!users) {
        return {
          message: "Error in get users model",
          status: false,
          error: 500,
        };
      }
      return users;
    } catch (error) {
      console.log(error);
      return {
        message: "Server error get maintenance type Sevice",
        status: false,
        error: 500,
      };
    }
  }

  async addRequestCompleted(recipient_id, data, files) {
    try {
      // console.log(recipient_id, data, files);
      const dataRequest = {
        title_request: data.title_request,
        content_request: data.content_request,
        maintenance_id: data.maintenance_id,
        petitioner_id: data.petitioner_id,
        recipient_id,
        solution_id: data.solution_id,
        status_id: data.status_id,
        processing_content_problem: data.processing_content_problem,
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
      // add file

      const request_id = resultAddRQ.insertId;
      const filelLength = files.length;
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
            error: 501,
          };
        }
      }

      const moveFile = await midService.moveFiles(files);
      if (!moveFile) {
        return {
          message: "Server error moveFile",
          status: false,
          error: 501,
        };
      }

      //processing detail
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
            error: 501,
          };
        }
      }
      return {
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
