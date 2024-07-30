const helperService = require("../services/helperService");

class helperController {
  // helper get list request
  async getRequestList(req, res) {
    try {
      let page;
      if (!req.query.page || !Number(req.query.page)) {
        page = 1;
      } else {
        page = req.query.page;
      }
      const result = await helperService.getRequestListByHelper(
        req.user.role_id,
        req.user.id,
        page
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // helper get list request by search

  async getRequestListSearch(req, res) {
    try {
      let page;
      if (!req.query.page || !Number(req.query.page)) {
        page = 1;
      } else {
        page = req.query.page;
      }
      const result = await helperService.getRequestListBySearch(
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

  // helper press take or watch user request
  async acceptRequest(req, res) {
    try {
      const result = await helperService.acceptRequest(
        req.params.request_id,
        req.user.id
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // handle update infor
  async updateHelpdeskInfor(req, res) {
    try {
      const resutl = await helperService.updateHelpdeskInfor(
        req.body,
        req.user.id
      );
      res.status(200).json(resutl);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }
  // save request processing status
  async saveStatusProcessing(req, res) {
    try {
      const result = await helperService.saveStatusProcessing(
        req.params.request_id,
        req.user.id,
        req.body.listProblem
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // add problem for request
  async addProblems(req, res) {
    try {
      const result = await helperService.addListProblem(
        req.body.request_id,
        req.user.id,
        req.body
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // update request problem
  async updateProblem(req, res) {
    try {
      const result = await helperService.updateProblem(
        req.body.request_id,
        req.user.id,
        req.body.problem_id,
        req.body.problem,
        req.body.updated_at
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // helper edit request
  async updateRequest(req, res) {
    try {
      const result = await helperService.updateRequest({
        title_request: req.body.title_request,
        content_request: req.body.content_request,
        request_id: req.body.request_id,
        maintenance_id: req.body.maintenance_id,

        recipient_id: req.user.id,
        role_id: req.user.role_id,
        page: req.query.page,
      });
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // delete reuest problem
  async deleteProblem(req, res) {
    try {
      const result = await helperService.deleteProblem(
        req.body.request_id,
        req.user.id,
        req.body.problem_id
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // helper delete request
  async deleteRequest(req, res) {
    try {
      const result = await helperService.deleteRequest(
        req.user.id,
        req.user.role_id,
        req.params.request_id,
        req.params.page
      );
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // helper get file
  async getFiles(req, res) {
    try {
      const result = await helperService.getFiles(req.params.request_id);

      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // hepler mark completed request after handle
  async verifyCompleted(req, res) {
    try {
      const result = await helperService.verifyCompleted(
        req.body.request_id,
        req.user.id,
        req.body
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // get form to mark completed request
  async getInforComplted(req, res) {
    try {
      const result = await helperService.getInforComplted(
        req.user.id,
        req.params.request_id,
        req.user.role_id
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // helper get all user to get user infor register request
  async getAllUser(req, res) {
    try {
      let page;
      Number(req.query.page) ? (page = req.query.page) : (page = 1);
      const result = await helperService.getAllUser(page);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // get user by id
  async getUserById(req, res) {
    try {
      const result = await helperService.getUserById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

  // hepler get list user by search
  async helperSearchUser(req, res) {
    try {
      let page;
      if (!req.query.page || !Number(req.query.page)) {
        page = 1;
      } else {
        page = req.query.page;
      }
      const result = await helperService.helperSearchUser(
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

// helper register complted request
  async addRequestComplete(req, res) {
    try {
      // console.log(req.body);
      const result = await helperService.addRequestCompleted(
        req.user,
        req.body,
        req.files
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }
}

module.exports = new helperController();
