const { pool } = require("../../config/db");
const bcrypt = require("bcryptjs");

module.exports = {
  getRequestList: async (petitioner_id, page) => {
    try {
      const numberPage = (page - 1) * 10;
      const result = await pool.query(
        `SELECT DISTINCT
          rs.id,
          rs.title_request,
          mt.type_name,
          rs.status_id,
          users.name AS petitioner,
          users2.name AS recipient,
          rs.created_at,
          rs.completion_date,
          mth.method_name

      FROM
          request_storage rs
      left JOIN
          maintenance_type mt ON rs.maintenance_id = mt.id
      JOIN
          request_status rstt ON rs.status_id = rstt.id
      JOIN
          users ON rs.petitioner_id = users.id
      LEFT JOIN
          users AS users2 ON rs.recipient_id = users2.id,
          method mth
      WHERE
          rs.petitioner_id = ${petitioner_id} and rs.method_id=mth.id ORDER BY rs.updated_at desc LIMIT 10 OFFSET ${numberPage};`
      );

      return result;
    } catch (error) {
      console.log("error model getRequestList:", error);
      return false;
    }
  },
  requestListBySearchText: async (
    petitioner_id,
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
              rs.petitioner_id=${petitioner_id}  and mth.id=rs.method_id ORDER BY rs.updated_at desc  LIMIT 10 OFFSET ${numberPage};`
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
               rs.petitioner_id=${petitioner_id} and mth.id=rs.method_id and  rs.status_id = ${status_id} ORDER BY rs.updated_at desc LIMIT 10 OFFSET ${numberPage} ;`
        );
        resutlSearch = result;
      } else if (text && !Number(status_id)) {
        let nameCondition = "rs.title_request";
        if (option == 2) {
          nameCondition = "mt.type_name";
        }
        if (option == 3) {
          nameCondition = "users.name";
        }
        if (option == 4) {
          nameCondition = "users2.name";
        }
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
              rs.petitioner_id=${petitioner_id} and mth.id=rs.method_id and  ${nameCondition} LIKE "%${text}%"  ORDER BY rs.updated_at desc LIMIT 10 OFFSET ${numberPage};`
        );
        resutlSearch = result;
      } else if (status_id && text) {
        let nameCondition = "rs.title_request";
        if (option == 2) {
          nameCondition = "mt.type_name";
        }
        if (option == 3) {
          nameCondition = "users.name";
        }
        if (option == 4) {
          nameCondition = "users2.name";
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
              rs.petitioner_id=${petitioner_id} and mth.id=rs.method_id and rs.status_id=${status_id} and ${nameCondition} LIKE "%${text}%" ORDER BY rs.updated_at desc LIMIT 10 OFFSET ${numberPage};`
        );
        resutlSearch = result;
      }

      return resutlSearch;
    } catch (error) {
      console.log("error model getRequestList By User :", error);
      return false;
    }
  },
  getRequestJustRegister: async (petitioner_id, request_id) => {
    try {
      const result = await pool.query(
        `SELECT DISTINCT 
    rs.id,
    rs.title_request,
    mt.type_name,
    mth.method_name,

    rs.status_id,
    users.name AS petitioner,
    users2.name AS recipient,
    rs.created_at,
    rs.completion_date 
FROM 
    request_storage rs
left JOIN 
    maintenance_type mt ON rs.maintenance_id = mt.id
JOIN 
    request_status rstt ON rs.status_id = rstt.id
JOIN 
    users ON rs.petitioner_id = users.id
JOIN 
    method mth ON rs.method_id = mth.id
LEFT JOIN 
    users AS users2 ON rs.recipient_id = users2.id
WHERE 
    rs.petitioner_id = ${petitioner_id} and rs.id = ${request_id} ;`
      );

      return result[0] ? result[0] : {};
    } catch (error) {
      console.log("error model getRequestList:", error);
      return false;
    }
  },
  getIdStatusByRequest: async (id) => {
    try {
      const result = await pool.query(
        `SELECT status_id FROM request_storage  WHERE request_storage.id=${id};`
      );
      return result[0] ? result[0].status_id : undefined;
    } catch (error) {
      console.log("error model getIdStatusByRequest:", error);
      return false;
    }
  },
  getRequestById: async (id) => {
    try {
      const result = await pool.query(
        `SELECT * FROM request_storage  WHERE request_storage.id=${id};`
      );
      return result[0] ? result[0] : {};
    } catch (error) {
      console.log("error model get request by ID:", error);
      return false;
    }
  },
  getNewRequest: async (id) => {
    try {
      const result = await pool.query(
        `SELECT DISTINCT

          rs.id,
          rs.title_request,
          mt.type_name,
          rs.status_id,
          users.name AS petitioner,
          users2.name AS recipient,
          rs.created_at,
          rs.completion_date,
          mth.method_name

      FROM
          request_storage rs
      left JOIN
          maintenance_type mt ON rs.maintenance_id = mt.id
      JOIN
          request_status rstt ON rs.status_id = rstt.id
      JOIN
          users ON rs.petitioner_id = users.id
      LEFT JOIN
          users AS users2 ON rs.recipient_id = users2.id
      LEFT JOIN method mth on rs.method_id = mth.id
      WHERE
          rs.id=${id}`
      );
      return result[0] ? result[0] : {};
    } catch (error) {
      console.log("error model get request by ID:", error);
      return false;
    }
  },
  // status_Register

  getMaintenanceType: async () => {
    try {
      const result = await pool.query(
        `SELECT id,type_name FROM maintenance_type`
      );

      return result ? result : [];
    } catch (error) {
      console.log("error model getMaintenanceType:", error);
      return false;
    }
  },

  getRequestConfirm_Register: async (id) => {
    try {
      const result = await pool.query(
        `SELECT rs.recipient_id,rs.id, rs.title_request,rs.content_request,mt.id AS maintenance_id,u.id AS user_id, u.name as name,u.account,u2.id AS r_id,u2.name AS r_name,

        u.affiliated_department,u.phone_number,mth.method_name,u.position,u.email,s.solution_name,rs.created_at,rstt.status_name as status_name
        FROM      request_storage rs
left JOIN 
    maintenance_type mt ON rs.maintenance_id = mt.id
JOIN 
    method mth ON rs.method_id = mth.id
JOIN 
    request_status rstt ON rs.status_id = rstt.id
left JOIN 
    users u ON rs.petitioner_id = u.id
    left JOIN 
    users u2 ON rs.recipient_id = u2.id
LEFT JOIN 
    solution s ON s.id=rs.solution_id
        WHERE rs.id=${id};
`
      );

      return result[0] ? result[0] : {};
    } catch (error) {
      console.log("error model getRequestConfirm:", error);
      return false;
    }
  },
  //
  getRequestCompleted: async (id) => {
    try {
      const result = await pool.query(
        `SELECT rs.id, rs.title_request,rs.content_request,rstt.status_name as status_name,rs.petitioner_id,u.name AS p_name,u.affiliated_department AS p_affiliated_department,
        u.phone_number AS p_phone_number,mth.method_name,u.position AS p_position,u.email AS p_email,u.account as p_account,rs.created_at, rs.processing_content_problem,
        mt.id AS maintenance_id,s.solution_name,u2.id AS r_id,u2.name AS r_name,u2.account as r_account,u2.affiliated_department AS r_affiliated_department,
        u2.phone_number AS r_phone_number ,u2.position AS r_position ,u2.email AS r_email
        FROM  request_storage rs
         JOIN
    method mth ON rs.method_id = mth.id
     LEFT JOIN
    solution s ON s.id=rs.solution_id
    left join maintenance_type mt on rs.maintenance_id=mt.id
    LEFT JOIN
    users u ON rs.petitioner_id =u.id
    left join
    users AS u2 on u2.id=rs.recipient_id,
     request_status rstt
        WHERE rs.id=${id} AND rs.status_id=rstt.id;`
      );

      return result[0] ? result[0] : {};
    } catch (error) {
      console.log("error model getRequestCompleted:", error);
      return false;
    }
  },

  getMaintenanceClassId: async (id) => {
    try {
      const result = await pool.query(
        `SELECT mc.id as mc_id,lb.id as label_id,lb.label_name,group_m 
        FROM maintenance_class mc left join list_label lb on lb.id=mc.list_label_id
        WHERE mc.maintenance_id=${id};`
      );

      return result ? result : [];
    } catch (error) {
      console.log("error model getMaintenanceById:", error);
      return false;
    }
  },

  getMaintenanceClassRequest: async (id) => {
    try {
      const result = await pool.query(
        `SELECT * FROM processing_details pd WHERE request_id=${id};`
      );
      return result ? result : [];
    } catch (error) {
      console.log("error model getMaintenanceById:", error);
      return false;
    }
  },
  // ///status_complete
  // update inforUser
  updateUserInfor: async (data, user_id) => {
    try {
      let result;
      if (!data.password) {
        result = await pool.query(
          `update users set 
          affiliated_department= "${data.affiliated_department}",
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
          affiliated_department= "${data.affiliated_department}",
          position= "${data.position}",
          phone_number= "${data.phone_number}",
          email= "${data.email}",
          tel_number= "${data.tel_number}"
          where id="${user_id}";`
        );
      }
      return result.affectedRows > 0 ? result : false;
    } catch (error) {
      console.log("error model UpdateUserInfor:", error);
      return false;
    }
  },
  // getAllproblem ByRequest_id
  getAllProblemByRequest_id: async (request_id) => {
    try {
      result = await pool.query(
        `select id, problem, updated_at as created_at from list_problem
          where request_id="${request_id}" order by created_at desc;`
      );
      return result;
    } catch (error) {
      console.log("error model UpdateUserInfor:", error);
      return false;
    }
  },
  registerRequest: async (data) => {
    try {
      let result;
      if (data.maintenance_id) {
        result = await pool.query(
          `insert into request_storage(title_request,content_request,maintenance_id,petitioner_id) values (?,?,?,?);`,
          [
            data.title_request,
            data.content_request,
            data.maintenance_id,
            data.petitioner_id,
          ]
        );
      } else {
        result = await pool.query(
          `insert into request_storage(title_request,content_request, petitioner_id) values (?,?,?);`,
          [data.title_request, data.content_request, data.petitioner_id]
        );
      }

      return result;
    } catch (error) {
      console.log("error model registerRequest:", error);
      return false;
    }
  },
  addRequestFile: async (request_id, filename) => {
    try {
      result = await pool.query(
        `insert into request_file(request_id,file_address) values (?,?);`,
        [request_id, filename]
      );
      return result;
    } catch (error) {
      console.log("error model addRequestFile:", error);
      return false;
    }
  },
  updateRequest: async (request_id, data) => {
    try {
      // console.log(data);
      !data.maintenance_id ? (data.maintenance_id = null) : data.maintenance_id;

      result = await pool.query(
        `update request_storage set
          title_request="${data.title_request}",
          content_request= "${data.content_request}",
          maintenance_id= ${data.maintenance_id}
          where id="${request_id}" and petitioner_id="${data.petitioner_id}";`
      );

      return result.affectedRows > 0 ? result : false;
    } catch (error) {
      console.log("error model UpdateRequest:", error);
      return false;
    }
  },
  deleteFile: async (filename) => {
    try {
      result = await pool.query(
        "DELETE FROM request_file WHERE file_address= ?",
        [filename]
      );
      // console.log(result);
      return result.affectedRows > 0 ? result : false;
    } catch (error) {
      console.log("error model Deletefile in Request:", error);
      return false;
    }
  },
  getAllFileByRequest: async (request_id) => {
    try {
      const result = await pool.query(
        `SELECT id, file_address FROM request_file WHERE request_id=${request_id};`
      );

      return result ? result : [];
    } catch (error) {
      console.log("error model getAllFileByRequest:", error);
      return false;
    }
  },
  deleteRequest: async (user_id, request_id) => {
    try {
      result = await pool.query(
        `DELETE FROM request_storage WHERE petitioner_id= "${user_id}" and id="${request_id}"`
      );
      return result.affectedRows > 0 ? result : false;
    } catch (error) {
      console.log("error model Delete request in Request storage:", error);
      return false;
    }
  },

  getUserInfor: async (user_id) => {
    try {
      const result = await pool.query(
        `SELECT users.id,users.account,users.name,affiliated_department,email,"일반사용자" as leveluser,position,phone_number,tel_number FROM users,roles WHERE users.id=${user_id} and users.role_id= roles.id;`
      );
      return result[0];
    } catch (error) {
      console.log("error model get user infor:", error);
      return false;
    }
  },
  getStatus: async () => {
    try {
      const result = await pool.query(
        `SELECT id, status_name from request_status`
      );
      return result;
    } catch (error) {
      console.log("error model get  status :", error);
      return false;
    }
  },
  getUserRequestCount: async (petitioner_id) => {
    try {
      const result = await pool.query(
        `SELECT count(rs.id) as requestCount
      FROM
          request_storage rs
      WHERE
          rs.petitioner_id = ${petitioner_id};`
      );
      return result[0].requestCount;
    } catch (error) {
      console.log("error model get  count request :", error);
      return false;
    }
  },

  getMainclassGroupById: async (maintenance_id) => {
    try {
      const result = await pool.query(
        `SELECT distinct group_m from maintenance_class where maintenance_id=${maintenance_id}`
      );
      return result;
    } catch (error) {
      console.log("error model get  status :", error);
      return false;
    }
  },
  getMainTypeGroup: async () => {
    try {
      const result = await pool.query(
        `SELECT distinct id,group_m,type_name from maintenance_type`
      );
      return result;
    } catch (error) {
      console.log("error model get  status :", error);
      return false;
    }
  },
  deleteListProblem: async (request_id) => {
    try {
      const result = await pool.query(
        `delete from list_problem where request_id="${request_id}"`
      );
      return result.affectedRows > 0 ? result : false;
    } catch (error) {
      console.log("error model DeleteListProblem :", error);
      return false;
    }
  },
  requestToOrther: async (petitioner_id, page) => {
    // console.log(petitioner_id, page);
    try {
      const numberPage = page * 10;
      const result = await pool.query(
        `SELECT DISTINCT

          rs.id,
          rs.title_request,
          mt.type_name,
          rs.status_id,
          users.name AS petitioner,
          users2.name AS recipient,
          rs.created_at,
          rs.completion_date,
          mth.method_name

      FROM
          request_storage rs
      left JOIN
          maintenance_type mt ON rs.maintenance_id = mt.id
      JOIN
          request_status rstt ON rs.status_id = rstt.id
      JOIN
          users ON rs.petitioner_id = users.id
      LEFT JOIN
          users AS users2 ON rs.recipient_id = users2.id,
          method mth
      WHERE
          rs.petitioner_id = ${petitioner_id} and rs.method_id=mth.id ORDER BY rs.updated_at desc LIMIT 1 OFFSET ${numberPage};`
      );
      // console.log(result);
      return result;
    } catch (error) {
      console.log("error model requestToOrther:", error);
      return false;
    }
  },
};
