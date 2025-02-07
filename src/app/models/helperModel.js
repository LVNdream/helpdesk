const { pool } = require("../../config/db");
const bcrypt = require("bcryptjs");

module.exports = {
  getRequestListByHelper: async (role_id, recipient_id, page) => {
    try {
      const startNumber = (page - 1) * 10;
      const endNumber = page * 10;

      //       const result = await pool.query(
      //         `SELECT DISTINCT
      //     rs.id,
      //     rs.title_request,
      //     mt.type_name,
      //     rs.status_id,
      //     users.name AS petitioner,
      //     users2.name AS recipient,
      //     rs.created_at,
      //     rs.completion_date ,mth.method_name
      // FROM
      //     request_storage rs
      // JOIN
      //     maintenance_type mt ON rs.maintenance_id = mt.id
      // JOIN
      //     request_status rstt ON rs.status_id = rstt.id
      // JOIN
      //     users ON rs.petitioner_id = users.id
      // LEFT JOIN
      //     users AS users2 ON rs.recipient_id = users2.id, method mth
      // WHERE
      //     rs.maintenance_id = ${role_id} and (rs.status_id=1 or rs.recipient_id=${recipient_id}) and mth.id=rs.method_id ORDER BY rs.created_at desc LIMIT 10 OFFSET ${numberPage};`
      //       );

      //  sua lai la co the chon ca 2

      let result = await pool.query(
        `SELECT DISTINCT 
    rs.id,
    rs.maintenance_id,
    rs.title_request,
    mt.type_name,
    rs.status_id,
    users.name AS petitioner,
    users2.name AS recipient,
    rs.created_at,
    rs.completion_date ,mth.method_name
FROM 
    request_storage rs
left JOIN 
    maintenance_type mt ON rs.maintenance_id = mt.id
JOIN 
    request_status rstt ON rs.status_id = rstt.id
JOIN 
    users ON rs.petitioner_id = users.id
LEFT JOIN 
    users AS users2 ON rs.recipient_id = users2.id, method mth
WHERE 
       (rs.status_id=1 or rs.recipient_id=${recipient_id}) and mth.id=rs.method_id ORDER BY rs.updated_at desc;`
      );
      // (rs.maintenance_id = ${role_id} or rs.maintenance_id is null )
      if (role_id != 5) {
        result = result.filter((item) => {
          return item.maintenance_id == role_id || item.maintenance_id == null;
        });
      }

      let listPagination = [];
      // console.log(resultByRoleById)
      for (let i = startNumber; i < endNumber; i++) {
        const item = result[i];
        // console.log(item)
        if (item) {
          listPagination.push(item);
        }
      }

      return listPagination;
    } catch (error) {
      console.log("error model getRequestListByHelper :", error);
      return false;
    }
  },

  requestListBySearchText: async (
    recipient_id,
    role_id,
    option,
    text,
    status_id,
    page
  ) => {
    try {
      const numberPage = (page - 1) * 10;
      let resutlSearch = await pool.query(
        `SELECT DISTINCT rs.id,rs.title_request,mt.type_name,rs.status_id, users.name AS petitioner,
            users2.name AS recipient,rs.created_at,rs.completion_date ,mth.method_name
            FROM 
                request_storage rs
            left JOIN 
                maintenance_type mt ON rs.maintenance_id = mt.id
            JOIN 
                request_status rstt ON rs.status_id = rstt.id
            JOIN 
                users ON rs.petitioner_id = users.id
            LEFT JOIN 
                 users AS users2 ON rs.recipient_id = users2.id, method mth
                 
            WHERE 
              (rs.maintenance_id = ${role_id} or rs.maintenance_id is null ) and (rs.status_id=1 or rs.recipient_id=${recipient_id})  and mth.id=rs.method_id ORDER BY rs.updated_at desc  LIMIT 10 OFFSET ${numberPage};`
      );

      if (status_id && Number(status_id) && !text) {
        const result = await pool.query(
          `SELECT DISTINCT rs.id,rs.title_request,mt.type_name,rs.status_id, users.name AS petitioner,
            users2.name AS recipient,rs.created_at,rs.completion_date ,mth.method_name
            FROM 
                request_storage rs
            left JOIN 
                maintenance_type mt ON rs.maintenance_id = mt.id
            JOIN 
                request_status rstt ON rs.status_id = rstt.id
            JOIN 
                users ON rs.petitioner_id = users.id
            LEFT JOIN 
                 users AS users2 ON rs.recipient_id = users2.id, method mth
                 
            WHERE 
              (rs.maintenance_id = ${role_id} or rs.maintenance_id is null ) and (rs.status_id=1 or rs.recipient_id=${recipient_id}) and mth.id=rs.method_id and  rs.status_id = ${status_id} ORDER BY rs.updated_at desc LIMIT 10 OFFSET ${numberPage} ;`
        );
        resutlSearch = result;
      } else if (text && !Number(status_id)) {
        let nameCondition = "users.name";

        if (option == 1) {
          nameCondition = "rs.request_title";
        } else if (option == 2) {
          nameCondition = "mt.type_name";
        } else if (option == 3) {
          nameCondition = "users.name";
        } else if (option == 4) {
          nameCondition = "users2.name";
        } else {
          nameCondition = "users.name";
        }
        console.log(nameCondition);
        // co
        const result = await pool.query(
          `SELECT DISTINCT rs.id,rs.title_request,mt.type_name,rs.status_id, users.name AS petitioner,
            users2.name AS recipient,rs.created_at,rs.completion_date ,mth.method_name
            FROM 
                request_storage rs
            left JOIN 
                maintenance_type mt ON rs.maintenance_id = mt.id
            JOIN 
                request_status rstt ON rs.status_id = rstt.id
            JOIN 
                users ON rs.petitioner_id = users.id
            LEFT JOIN 
                 users AS users2 ON rs.recipient_id = users2.id, method mth
            WHERE 
               (rs.maintenance_id = ${role_id} or rs.maintenance_id is null ) and (rs.status_id=1 or rs.recipient_id=${recipient_id}) and mth.id=rs.method_id and  ${nameCondition} LIKE "%${text}%"  ORDER BY rs.updated_at desc LIMIT 10 OFFSET ${numberPage};`
        );
        resutlSearch = result;
      } else if (status_id && text) {
        let nameCondition = "users.name";
        if (option == 1) {
          nameCondition = "rs.request_title";
        } else if (option == 2) {
          nameCondition = "mt.type_name";
        } else if (option == 3) {
          nameCondition = "users.name";
        } else if (option == 4) {
          nameCondition = "users2.name";
        } else {
          nameCondition = "users.name";
        }
        // console.log(nameCondition);
        const result = await pool.query(
          `SELECT DISTINCT rs.id,rs.title_request,mt.type_name,rs.status_id, users.name AS petitioner,
            users2.name AS recipient,rs.created_at,rs.completion_date ,mth.method_name
            FROM 
                request_storage rs
           left JOIN 
                maintenance_type mt ON rs.maintenance_id = mt.id
            JOIN 
                request_status rstt ON rs.status_id = rstt.id
            JOIN 
                users ON rs.petitioner_id = users.id
            LEFT JOIN 
                 users AS users2 ON rs.recipient_id = users2.id, method mth
            WHERE 
               (rs.maintenance_id = ${role_id} or rs.maintenance_id is null ) and (rs.status_id=1 or rs.recipient_id=${recipient_id}) and mth.id=rs.method_id and rs.status_id=${status_id} and ${nameCondition} LIKE "%${text}%"  ORDER BY rs.updated_at desc LIMIT 10 OFFSET ${numberPage};`
        );
        resutlSearch = result;
      }

      return resutlSearch;
    } catch (error) {
      console.log("error model getRequestList By User :", error);
      return false;
    }
  },

  updateStatus_id: async (request_id, status_id) => {
    try {
      result = await pool.query(
        `update request_storage set
          status_id="${status_id}"
          where id="${request_id}";`
      );
      // console.log(request_id, status_id);
      // console.log(result);

      return result.affectedRows > 0 ? result : false;
    } catch (error) {
      console.log("error model Update request Status_id:", error);
      return false;
    }
  },

  updateRecipient_id: async (request_id, recipient_id) => {
    try {
      result = await pool.query(
        `update request_storage set
          recipient_id="${recipient_id}"
          where id="${request_id}";`
      );

      return result.affectedRows > 0 ? result : false;
    } catch (error) {
      console.log("error model Update  request recipient_id:", error);
      return false;
    }
  },
  // getInforHelpdesk

  getHelpdeskInfor: async (user_id) => {
    try {
      const result = await pool.query(
        `SELECT users.id,users.account,users.name,company.name_company,email,"헬프데스크 담당자" as leveluser,users.position,users.phone_number,users.tel_number FROM users left join roles on users.role_id= roles.id left join company on users.company_id= company.id  WHERE users.id=${user_id};`
      );
      return result[0];
    } catch (error) {
      console.log("error model get helpdesk infor:", error);
      return false;
    }
  },
  // updateInforHelpdesk
  updateHelpdeskInfor: async (data, user_id) => {
    try {
      let result;
      if (!data.password) {
        result = await pool.query(
          `update users set 
          position= "${data.position}",
          phone_number= "${data.phone_number}",
          tel_number= "${data.tel_number}" ,
          email= "${data.email}" 
          where id="${user_id}";`
        );
      } else {
        const password_hash = bcrypt.hashSync(data.password, 8);

        result = await pool.query(
          `update users set
          password="${password_hash}",
          position= "${data.position}",
          phone_number= "${data.phone_number}",
          email= "${data.email}",
          tel_number= "${data.tel_number}"
          where id="${user_id}";`
        );
      }
      return result.affectedRows > 0 ? result : false;
    } catch (error) {
      console.log("error model updateHelpdeskInfor:", error);
      return false;
    }
  },

  addListProblem: async (request_id, data) => {
    try {
      // console.log(data);
      let timeCreate = new Date(Date.now());
      // console.log(timeCreate)
      result = await pool.query(
        `insert into list_problem(request_id,problem,created_at,updated_at) values (?,?,?,?);`,
        [request_id, data.problem, timeCreate, timeCreate]
      );
      return result;
    } catch (error) {
      console.log("error model registerRequest:", error);
      return false;
    }
  },
  //upadte problem
  updateProblem: async (problem_id, problem, updated_at) => {
    try {
      const timeUpdate = new Date(parseInt(updated_at));
      result = await pool.query(
        `update list_problem set
          problem="${problem}",
          updated_at=?
          where id="${problem_id}";`,
        [timeUpdate]
      );

      return result.affectedRows > 0 ? result : false;
    } catch (error) {
      console.log("error model Update  request problem:", error);
      return false;
    }
  },

  //

  // xao mot van de
  deleteProblem: async (problem_id) => {
    try {
      result = await pool.query(
        `DELETE FROM list_problem WHERE id="${problem_id}"`
      );
      return result.affectedRows > 0 ? result : false;
    } catch (error) {
      console.log("error model Delete problem in list problem:", error);
      return false;
    }
  },

  deleteListProcessByRequest: async (request_id) => {
    try {
      result = await pool.query(
        `DELETE FROM processing_details WHERE request_id= "${request_id}"`
      );
      return result.affectedRows > 0 ? result : false;
    } catch (error) {
      console.log("error model Delete company :", error);
      return false;
    }
  },

  addProcessingDetail: async (request_id, label_id) => {
    try {
      // console.log(data);
      result = await pool.query(
        `insert into processing_details(request_id,label_id) values (?,?);`,
        [request_id, label_id]
      );
      return result;
    } catch (error) {
      console.log("error model add ProcessingDetail:", error);
      return false;
    }
  },

  helperDeleteRequest: async (user_id, request_id) => {
    try {
      result = await pool.query(
        `DELETE FROM request_storage WHERE recipient_id= "${user_id}" and id="${request_id}"`
      );
      return result.affectedRows > 0 ? result : false;
    } catch (error) {
      console.log("error model Delete request in Request storage:", error);
      return false;
    }
  },

  addDataTocompleted: async (request_id, data) => {
    try {
      result = await pool.query(
        `update request_storage set
        processing_content_problem = "${data.processing_content_problem}",
        solution_id = ${data.solution_id},
        completion_date = CURRENT_TIMESTAMP(),
        status_id = ${data.status_id}
        where id=${request_id};`
      );
      return result;
    } catch (error) {
      console.log("error model add ProcessingDetail:", error);
      return false;
    }
  },

  getMaintenanceType: async () => {
    try {
      result = await pool.query(`select id,type_name from maintenance_type`);
      return result;
    } catch (error) {
      console.log("error model get maintenance:", error);
      return false;
    }
  },

  getMethod: async () => {
    try {
      result = await pool.query(
        `select id,method_name as name from method where id!=1`
      );
      return result;
    } catch (error) {
      console.log("error model get method:", error);
      return false;
    }
  },

  getSolution: async () => {
    try {
      result = await pool.query(
        `select id,solution_name as name from solution`
      );
      return result;
    } catch (error) {
      console.log("error model get solution:", error);
      return false;
    }
  },

  getStatus: async () => {
    try {
      result = await pool.query(
        `select id,status_name as name from request_status`
      );
      return result;
    } catch (error) {
      console.log("error model get status:", error);
      return false;
    }
  },

  getAllUser: async (page) => {
    try {
      const numberPage = (page - 1) * 10;

      result = await pool.query(
        `select id,account,name,position,affiliated_department,phone_number,email from users where role_id=4 and status_id=2 order by created_at desc limit 10 offset ${numberPage} `
      );
      return result;
    } catch (error) {
      console.log("error model get all user:", error);
      return false;
    }
  },

  helperSearchUser: async (option, text, page) => {
    try {
      const numberPage = (page - 1) * 10;
      let resutlSearch;
      let resultCount;
      if (!text) {
        resutlSearch = await pool.query(
          `select id,name,position,affiliated_department,phone_number,email from users where role_id=4 order by created_at desc limit 10 offset ${numberPage} `
        );
        resultCount = await pool.query(
          `select id,name,position,affiliated_department,phone_number,email from users where role_id=4 and status_id=2 order by created_at desc `
        );
      }

      // search
      else if (text) {
        let nameCondition = "u.account";
        if (option == 1) {
          nameCondition = "u.name";
        } else if (option == 2) {
          nameCondition = "u.position";
        } else if (option == 3) {
          nameCondition = "u.affiliated_department";
        } else if (option == 4) {
          nameCondition = "u.email";
        } else if (option == 5) {
          nameCondition = "u.phone_number";
        } else if (option == 6) {
          nameCondition = "u.account";
        } else {
          nameCondition = "u.account";
        }
        resutlSearch = await pool.query(
          `select u.id,u.name,u.account,position,u.affiliated_department,u.phone_number,u.email from users u left join account_status u_s on u.status_id=u_s.id 
          where role_id=4 and ${nameCondition} like "%${text}%" order by u.created_at desc limit 10 offset ${numberPage} `
        );
        resultCount = await pool.query(
          `select u.id,u.name,position,u.affiliated_department,u.phone_number,u.email from users u left join account_status u_s on u.status_id=u_s.id where role_id=4 and ${nameCondition} like "%${text}%" `
        );
      }

      return {
        listFilter: resutlSearch,
        requestCount: resultCount.length,
      };
    } catch (error) {
      console.log("error model helperSearchUser :", error);
      return false;
    }
  },

  getUserCount: async () => {
    try {
      result = await pool.query(
        `select id,name,account,position,affiliated_department,phone_number,email from users where role_id=4 and status_id=2 order by created_at desc`
      );
      return result ? result.length : 0;
    } catch (error) {
      console.log("error model get all user:", error);
      return false;
    }
  },

  addRequestCompelted: async (data) => {
    try {
      // let timeRequest;
      // if (!data.timeRequest) {
      //   timeRequest = new Date(Date.now());
      // } else {
      const timeRequest = new Date(parseInt(data.timeRequest));

      // }
      result = await pool.query(
        `insert request_storage(
        title_request,
        content_request,
        maintenance_id,
        petitioner_id,
        recipient_id,
        method_id,
        solution_id,
        status_id,
        processing_content_problem,
        created_at,
        completion_date) values (?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP());`,
        [
          data.title_request,
          data.content_request,
          data.maintenance_id,
          data.petitioner_id,
          data.recipient_id,
          data.method_id,
          data.solution_id,
          data.status_id,
          data.processing_content_problem,
          timeRequest,
        ]
      );
      return result;
    } catch (error) {
      console.log("error model registerRequestCompleted:", error);
      return false;
    }
  },

  getHelperRequestCount: async (recipient_id, role_id) => {
    try {
      // const result = await pool.query(
      //   `SELECT count(rs.id) as requestCount
      // FROM
      //     request_storage rs
      // WHERE
      //     rs.maintenance_id = ${role_id} and (rs.status_id=1 or rs.recipient_id=${recipient_id});`
      // );
      let result = await pool.query(
        `SELECT DISTINCT 
    rs.id,
    rs.maintenance_id,
    rs.title_request,
    mt.type_name,
    rs.status_id,
    users.name AS petitioner,
    users2.name AS recipient,
    rs.created_at,
    rs.completion_date ,mth.method_name
FROM 
    request_storage rs
left JOIN 
    maintenance_type mt ON rs.maintenance_id = mt.id
JOIN 
    request_status rstt ON rs.status_id = rstt.id
JOIN 
    users ON rs.petitioner_id = users.id
LEFT JOIN 
    users AS users2 ON rs.recipient_id = users2.id, method mth
WHERE 
      (rs.status_id=1 or rs.recipient_id=${recipient_id}) and mth.id=rs.method_id ORDER BY rs.updated_at desc;`
      );
      if (role_id != 5) {
        result = result.filter((item) => {
          return item.maintenance_id == role_id;
        });
      }

      return result ? result.length : false;
    } catch (error) {
      console.log("error model get  count request :", error);
      return false;
    }
  },

  deleteRequest: async (user_id, request_id) => {
    try {
      result = await pool.query(
        `DELETE FROM request_storage WHERE recipient_id= "${user_id}" and id="${request_id}"`
      );
      return result.affectedRows > 0 ? result : false;
    } catch (error) {
      console.log("error model Delete request in Request storage:", error);
      return false;
    }
  },

  requestToOrther: async (recipient_id, role_id, page) => {
    try {
      const startNumber = page * 10;
      const endNumber = (page + 1) * 10;
      let result = await pool.query(
        `SELECT DISTINCT 
    rs.id,
    rs.maintenance_id,
    rs.title_request,
    mt.type_name,
    rs.status_id,
    users.name AS petitioner,
    users2.name AS recipient,
    rs.created_at,
    rs.completion_date ,mth.method_name
FROM 
    request_storage rs
left JOIN 
    maintenance_type mt ON rs.maintenance_id = mt.id
JOIN 
    request_status rstt ON rs.status_id = rstt.id
JOIN 
    users ON rs.petitioner_id = users.id
LEFT JOIN 
    users AS users2 ON rs.recipient_id = users2.id, method mth
WHERE 
      (rs.status_id=1 or rs.recipient_id=${recipient_id}) and mth.id=rs.method_id ORDER BY rs.updated_at desc;`
      );
      if (role_id != 5) {
        result = result.filter((item) => {
          return item.maintenance_id == role_id;
        });
      }

      let listPagination = [];
      // console.log(resultByRoleById)
      for (let i = startNumber; i < endNumber; i++) {
        const item = result[i];
        // console.log(item)
        if (item) {
          listPagination.push(item);
        }
      }

      return listPagination;
    } catch (error) {
      console.log("error model requestToOrther:", error);
      return false;
    }
  },

  updateRequest: async (data) => {
    try {
      !data.maintenance_id ? (data.maintenance_id = null) : data.maintenance_id;
      result = await pool.query(
        `update request_storage set
          title_request="${data.title_request}",
          content_request= "${data.content_request}",
          maintenance_id= ${data.maintenance_id},
          updated_at=?
          where id="${data.request_id}" and recipient_id="${data.recipient_id}";`,
        [data.updated_at]
      );
      return result.affectedRows > 0 ? result : false;
    } catch (error) {
      console.log("error model heplpDesk UpdateRequest:", error);
      return false;
    }
  },
  resetRequest: async (data) => {
    try {
      result = await pool.query(
        `update request_storage set
          status_id=1,
          recipient_id = NULL
          where id="${data.request_id}";`
      );
      return result.affectedRows > 0 ? result : false;
    } catch (error) {
      console.log("error model heplpDesk resetRequest:", error);
      return false;
    }
  },
  type_name_ById: async (maintenance_id) => {
    try {
      result = await pool.query(
        `select type_name from maintenance_type where id=${maintenance_id}`
      );
      // console.log(result)
      return result[0].type_name ? result[0].type_name : false;
    } catch (error) {
      console.log("error model type_name_ById:", error);
      return false;
    }
  },
};
