const { pool } = require("../../config/db");
const bcrypt = require("bcryptjs");

module.exports = {
  getRequestList: async (id) => {
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
    rs.completion_date 
FROM 
    request_storage rs
JOIN 
    maintenance_type mt ON rs.maintenance_id = mt.id
JOIN 
    request_status rstt ON rs.status_id = rstt.id
JOIN 
    users ON rs.petitioner_id = users.id
LEFT JOIN 
    users AS users2 ON rs.recipient_id = users2.id
WHERE 
    rs.petitioner_id = ${id};`
      );

      return result;
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
      return result[0].status_id ? result[0].status_id : undefined;
    } catch (error) {
      console.log("error model getIdStatusByRequest:", error);
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

  // getRequestRegister: async (id) => {
  //   try {
  //     const result = await pool.query(
  //       `SELECT rs.id, rs.title_request,rs.content_request,method.method_name,mt.id AS maintenance_id,u.id AS user_id,u.name,u.affiliated_department,u.phone_number,u.position,u.email,rs.created_at
  //       FROM  request_storage rs,maintenance_type mt, users u, method
  //       WHERE rs.id=${id} AND rs.maintenance_id=mt.id AND rs.petitioner_id =u.id and method.id=rs.method_id;`
  //     );

  //     return result[0] ? result[0] : {};
  //   } catch (error) {
  //     console.log("error model getRequestRegister:", error);
  //     return false;
  //   }
  // },
  // status_confirm
  getRequestConfirm_Register: async (id) => {
    try {
      const result = await pool.query(
        `SELECT rs.id, rs.title_request,rs.content_request,mt.id AS maintenance_id,u.id AS user_id,u.name,u.affiliated_department,u.phone_number,u.position,u.email,s.solution_name,rs.created_at
        FROM      request_storage rs
JOIN 
    maintenance_type mt ON rs.maintenance_id = mt.id
JOIN 
    request_status rstt ON rs.status_id = rstt.id
JOIN 
    users u ON rs.petitioner_id = u.id
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
        `SELECT rs.id, rs.title_request,rs.content_request,rs.petitioner_id,u.name AS p_name,u.affiliated_department AS p_affiliated_department,
        u.phone_number AS p_phone_number,u.position AS p_position,u.email AS p_email,rs.created_at, rs.processing_content_problem,
        mt.id AS maintenance_id,s.solution_name,u2.id AS r_id,u2.name AS r_name,u2.affiliated_department AS r_affiliated_department,
        u2.phone_number AS r_phone_number ,u2.position AS r_position ,u.email AS r_email
        FROM  request_storage rs LEFT JOIN 
    solution s ON s.id=rs.solution_id,maintenance_type mt, users u,request_status rstt,  users AS u2
        WHERE rs.id=${id} AND rs.maintenance_id=mt.id AND rs.petitioner_id =u.id AND rs.status_id=rstt.id AND u2.id=rs.recipient_id;`
      );

      return result[0] ? result[0] : {};
    } catch (error) {
      console.log("error model getRequestProcessing:", error);
      return false;
    }
  },

  // status_processing
  // getRequestProcessing: async (id) => {
  //   try {
  //     const result = await pool.query(
  //       `SELECT rs.id, rs.title_request,rs.content_request,rs.petitioner_id,u.name AS p_name,u.affiliated_department AS p_affiliated_department,
  //       u.phone_number AS p_phone_number,u.position AS p_position,u.email AS p_email,rs.created_at,
  //       mt.id AS maintenance_id,mt.type_name,s.solution_name,rstt.status_name,u2.name AS r_name,u2.affiliated_department AS r_affiliated_department,
  //       u2.phone_number AS r_phone_number ,u2.position AS r_position ,u.email AS r_email
  //       FROM  request_storage rs,maintenance_type mt, users u,request_details rd,solution s,request_status rstt, (SELECT * FROM users) AS u2
  //       WHERE rs.id=${id} AND rs.maintenance_id=mt.id AND rs.petitioner_id =u.id AND rd.request_id=rs.id AND s.id=rd.solution_id AND rd.status_id=rstt.id AND u2.id=rs.recipient_id;`
  //     );

  //     return result[0] ? result[0] : {};
  //   } catch (error) {
  //     console.log("error model getRequestProcessing:", error);
  //     return false;
  //   }
  // },

  getMaintenanceClassId: async (id) => {
    try {
      const result = await pool.query(
        `SELECT id,name,group_m FROM maintenance_class WHERE maintenance_id=${id};`
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
      console.log(data);
      let result;
      if (data.password == "") {
        result = await pool.query(
          `update users set 
          name="${data.name}",
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
          name="${data.name}",
          affiliated_department= "${data.affiliated_department}",
          position= "${data.position}",
          phone_number= "${data.phone_number}",
          email= "${data.email}",
          tel_number= "${data.tel_number}"
          where id="${user_id}";`
        );
      }
      return result;
    } catch (error) {
      console.log("error model UpdateUserInfor:", error);
      return false;
    }
  },
  // getAllproblem ByRequest_id
  getAllProblemByRequest_id: async (request_id) => {
    try {
      result = await pool.query(
        `select id, problem from list_problem
          where request_id="${request_id}";`
      );
      return result;
    } catch (error) {
      console.log("error model UpdateUserInfor:", error);
      return false;
    }
  },
  registerRequest: async (data) => {
    try {
      // console.log(data);
      result = await pool.query(
        `insert into request_storage(title_request,content_request,maintenance_id,petitioner_id) values (?,?,?,?);`,
        [
          data.title_request,
          data.content_request,
          data.maintenance_id,
          data.petitioner_id,
        ]
      );
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
      result = await pool.query(
        `update request_storage set
          title_request="${data.title_request}",
          content_request= "${data.content_request}",
          maintenance_id= "${data.maintenance_id}"
          where id="${request_id}";`
      );

      return result;
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
      return result;
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
};
