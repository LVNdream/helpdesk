const helperService = require("../services/helperService");

class helperController {
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

  // updateHelpDeskInfor

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
  // save status processing
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
  // update processing
  async addProblems(req, res) {
    try {
      const result = await helperService.addListProblem(
        req.body.request_id,
        req.user.id,
        req.body.listProblem
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }
  async updateProblem(req, res) {
    try {
      const result = await helperService.updateProblem(
        req.body.request_id,
        req.user.id,
        req.body.problem_id,
        req.body.problem
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }
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

  async getFiles(req, res) {
    try {
      const result = await helperService.getFiles(req.params.request_id);

      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  }

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

  async helperSearchUser(req, res) {
    try {
      let page;
      if (!req.query.page || !Number(req.query.page)) {
        page = 1;
      } else {
        page = req.query.page;
      }
      const result = await helperService.helperSearchUser(
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

  async addRequestComplete(req, res) {
    try {
      // console.log(req.body);
      const result = await helperService.addRequestCompleted(
        req.user.id,
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
