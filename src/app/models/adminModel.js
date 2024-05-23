const { pool } = require("../../config/db");

module.exports = {
  getRequestListByAdmin: async (page) => {
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
    rs.completion_date ,mth.method_name
FROM 
    request_storage rs
JOIN 
    maintenance_type mt ON rs.maintenance_id = mt.id
JOIN 
    request_status rstt ON rs.status_id = rstt.id
JOIN 
    users ON rs.petitioner_id = users.id
LEFT JOIN 
    users AS users2 ON rs.recipient_id = users2.id, method mth
WHERE 
     mth.id=rs.method_id ORDER BY rs.id asc LIMIT 10 OFFSET ${numberPage};`
      );

      return result;
    } catch (error) {
      console.log("error model getRequestList By Admin :", error);
      return false;
    }
  },

  requestListBySearchText: async (
    user_id,
    role_id,
    option,
    text,
    status_id,
    page
  ) => {
    try {
      const numberPage = (page - 1) * 10;
      let resutlSearch;
      let resultNoLimit;
      // init
      if (role_id == 3) {
        resutlSearch = await pool.query(
          `SELECT DISTINCT rs.id,rs.title_request,mt.type_name,rs.status_id, users.name AS petitioner,rs.petitioner_id,rs.recipient_id,rs.maintenance_id,
            users2.name AS recipient,rs.created_at,rs.completion_date ,mth.method_name
            FROM 
                request_storage rs
            JOIN 
                maintenance_type mt ON rs.maintenance_id = mt.id
            JOIN 
                request_status rstt ON rs.status_id = rstt.id
            JOIN 
                users ON rs.petitioner_id = users.id
            LEFT JOIN 
                 users AS users2 ON rs.recipient_id = users2.id, method mth
            WHERE 
                mth.id=rs.method_id ORDER BY rs.id asc  LIMIT 10 OFFSET ${numberPage};`
        );
        resultNoLimit = await pool.query(
          `SELECT DISTINCT rs.id,rs.title_request,mt.type_name,rs.status_id, users.name AS petitioner,rs.petitioner_id,rs.recipient_id,rs.maintenance_id,
            users2.name AS recipient,rs.created_at,rs.completion_date ,mth.method_name
            FROM 
                request_storage rs
            JOIN 
                maintenance_type mt ON rs.maintenance_id = mt.id
            JOIN 
                request_status rstt ON rs.status_id = rstt.id
            JOIN 
                users ON rs.petitioner_id = users.id
            LEFT JOIN 
                 users AS users2 ON rs.recipient_id = users2.id, method mth
            WHERE 
                mth.id=rs.method_id;`
        );
      } else if (role_id == 0) {
        resutlSearch = await pool.query(
          `SELECT DISTINCT rs.id,rs.title_request,mt.type_name,rs.status_id, users.name AS petitioner,rs.petitioner_id,rs.recipient_id,rs.maintenance_id,
            users2.name AS recipient,rs.created_at,rs.completion_date ,mth.method_name
            FROM 
                request_storage rs
            JOIN 
                maintenance_type mt ON rs.maintenance_id = mt.id
            JOIN 
                request_status rstt ON rs.status_id = rstt.id
            JOIN 
                users ON rs.petitioner_id = users.id
            LEFT JOIN 
                 users AS users2 ON rs.recipient_id = users2.id, method mth
            WHERE 
                mth.id=rs.method_id and rs.petitioner_id=${user_id} ORDER BY rs.id asc  LIMIT 10 OFFSET ${numberPage};`
        );
        resultNoLimit = await pool.query(
          `SELECT DISTINCT rs.id,rs.title_request,mt.type_name,rs.status_id, users.name AS petitioner,rs.petitioner_id,rs.recipient_id,rs.maintenance_id,
            users2.name AS recipient,rs.created_at,rs.completion_date ,mth.method_name
            FROM 
                request_storage rs
            JOIN 
                maintenance_type mt ON rs.maintenance_id = mt.id
            JOIN 
                request_status rstt ON rs.status_id = rstt.id
            JOIN 
                users ON rs.petitioner_id = users.id
            LEFT JOIN 
                 users AS users2 ON rs.recipient_id = users2.id, method mth
            WHERE 
                mth.id=rs.method_id and rs.petitioner_id=${user_id} ;`
        );
      } else if (role_id == 1 || role_id == 2) {
        resutlSearch = await pool.query(
          `SELECT DISTINCT rs.id,rs.title_request,mt.type_name,rs.status_id, users.name AS petitioner,rs.petitioner_id,rs.recipient_id,rs.maintenance_id,
            users2.name AS recipient,rs.created_at,rs.completion_date ,mth.method_name
            FROM 
                request_storage rs
            JOIN 
                maintenance_type mt ON rs.maintenance_id = mt.id
            JOIN 
                request_status rstt ON rs.status_id = rstt.id
            JOIN 
                users ON rs.petitioner_id = users.id
            LEFT JOIN 
                 users AS users2 ON rs.recipient_id = users2.id, method mth
            WHERE 
                mth.id=rs.method_id and data.maintenance_id = ${role_id} and (rs.status_id = 1 or rs.recipient_id = user_id) ORDER BY rs.id asc  LIMIT 10 OFFSET ${numberPage};`
        );
        resultNoLimit = await pool.query(
          `SELECT DISTINCT rs.id,rs.title_request,mt.type_name,rs.status_id, users.name AS petitioner,rs.petitioner_id,rs.recipient_id,rs.maintenance_id,
            users2.name AS recipient,rs.created_at,rs.completion_date ,mth.method_name
            FROM 
                request_storage rs
            JOIN 
                maintenance_type mt ON rs.maintenance_id = mt.id
            JOIN 
                request_status rstt ON rs.status_id = rstt.id
            JOIN 
                users ON rs.petitioner_id = users.id
            LEFT JOIN 
                 users AS users2 ON rs.recipient_id = users2.id, method mth
            WHERE 
                mth.id=rs.method_id and data.maintenance_id = ${role_id} and (rs.status_id = 1 or rs.recipient_id = user_id);`
        );
      }

      // search
      if (status_id && Number(status_id) && !text) {
        const result = await pool.query(
          `SELECT DISTINCT rs.id,rs.title_request,mt.type_name,rs.status_id, users.name AS petitioner,rs.petitioner_id,rs.recipient_id,rs.maintenance_id,
            users2.name AS recipient,rs.created_at,rs.completion_date ,mth.method_name
            FROM 
                request_storage rs
            JOIN 
                maintenance_type mt ON rs.maintenance_id = mt.id
            JOIN 
                request_status rstt ON rs.status_id = rstt.id
            JOIN 
                users ON rs.petitioner_id = users.id
            LEFT JOIN 
                 users AS users2 ON rs.recipient_id = users2.id, method mth
            WHERE 
                mth.id=rs.method_id and  rs.status_id = ${status_id} ORDER BY rs.id asc LIMIT 10 OFFSET ${numberPage}  ;`
        );
        resutlSearch = result;
        resultNoLimit = await pool.query(
          `SELECT DISTINCT rs.id,rs.title_request,mt.type_name,rs.status_id, users.name AS petitioner,rs.petitioner_id,rs.recipient_id,rs.maintenance_id,
            users2.name AS recipient,rs.created_at,rs.completion_date ,mth.method_name
            FROM 
                request_storage rs
            JOIN 
                maintenance_type mt ON rs.maintenance_id = mt.id
            JOIN 
                request_status rstt ON rs.status_id = rstt.id
            JOIN 
                users ON rs.petitioner_id = users.id
            LEFT JOIN 
                 users AS users2 ON rs.recipient_id = users2.id, method mth
            WHERE 
                mth.id=rs.method_id and  rs.status_id = ${status_id} ;`
        );
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
          `SELECT DISTINCT rs.id,rs.title_request,mt.type_name,rs.status_id, users.name AS petitioner,rs.petitioner_id,rs.recipient_id,rs.maintenance_id,
            users2.name AS recipient,rs.created_at,rs.completion_date ,mth.method_name
            FROM 
                request_storage rs
            JOIN 
                maintenance_type mt ON rs.maintenance_id = mt.id
            JOIN 
                request_status rstt ON rs.status_id = rstt.id
            JOIN 
                users ON rs.petitioner_id = users.id
            LEFT JOIN 
                 users AS users2 ON rs.recipient_id = users2.id, method mth
                 
            WHERE 
                mth.id=rs.method_id and  ${nameCondition} LIKE "%${text}%" ORDER BY rs.id asc LIMIT 10 OFFSET ${numberPage} ;`
        );
        resutlSearch = result;
        resultNoLimit = await pool.query(
          `SELECT DISTINCT rs.id,rs.title_request,mt.type_name,rs.status_id, users.name AS petitioner,rs.petitioner_id,rs.recipient_id,rs.maintenance_id,
            users2.name AS recipient,rs.created_at,rs.completion_date ,mth.method_name
            FROM 
                request_storage rs
            JOIN 
                maintenance_type mt ON rs.maintenance_id = mt.id
            JOIN 
                request_status rstt ON rs.status_id = rstt.id
            JOIN 
                users ON rs.petitioner_id = users.id
            LEFT JOIN 
                 users AS users2 ON rs.recipient_id = users2.id, method mth
                 
            WHERE 
                mth.id=rs.method_id and  ${nameCondition} LIKE "%${text}%";`
        );
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

        const result = await pool.query(
          `SELECT DISTINCT rs.id,rs.title_request,mt.type_name,rs.status_id, users.name AS petitioner,rs.petitioner_id,rs.recipient_id,rs.maintenance_id,
            users2.name AS recipient,rs.created_at,rs.completion_date ,mth.method_name
            FROM 
                request_storage rs
            JOIN 
                maintenance_type mt ON rs.maintenance_id = mt.id
            JOIN 
                request_status rstt ON rs.status_id = rstt.id
            JOIN 
                users ON rs.petitioner_id = users.id
            LEFT JOIN 
                 users AS users2 ON rs.recipient_id = users2.id, method mth
            WHERE 
                mth.id=rs.method_id and rs.status_id=${status_id} and ${nameCondition} LIKE "%${text}%" ORDER BY rs.id asc LIMIT 10 OFFSET ${numberPage} ;`
        );
        resutlSearch = result;
        resultNoLimit = await pool.query(
          `SELECT DISTINCT rs.id,rs.title_request,mt.type_name,rs.status_id, users.name AS petitioner,rs.petitioner_id,rs.recipient_id,rs.maintenance_id,
            users2.name AS recipient,rs.created_at,rs.completion_date ,mth.method_name
            FROM 
                request_storage rs
            JOIN 
                maintenance_type mt ON rs.maintenance_id = mt.id
            JOIN 
                request_status rstt ON rs.status_id = rstt.id
            JOIN 
                users ON rs.petitioner_id = users.id
            LEFT JOIN 
                 users AS users2 ON rs.recipient_id = users2.id, method mth
            WHERE 
                mth.id=rs.method_id and rs.status_id=${status_id} and ${nameCondition} LIKE "%${text}%";`
        );
      }

      let resultByRoleById;
      let requestToCount;
      if (role_id == 3) {
        resultByRoleById = resutlSearch;
        requestToCount = resultNoLimit;
      } else if (role_id == 0) {
        resultByRoleById = resutlSearch.filter((data) => {
          return data.petitioner_id == user_id;
        });
        requestToCount = resultNoLimit.filter((data) => {
          return data.petitioner_id == user_id;
        });
      } else if (role_id == 1 || role_id == 2) {
        resultByRoleById = resutlSearch.filter((data) => {
          return (
            data.maintenance_id == role_id &&
            (data.status_id == 1 || data.recipient_id == user_id)
          );
        });
        requestToCount = resultNoLimit.filter((data) => {
          return (
            data.maintenance_id == role_id &&
            (data.status_id == 1 || data.recipient_id == user_id)
          );
        });
      }

      return {
        listFilter: resultByRoleById,
        requestCount: requestToCount.length,
      };
    } catch (error) {
      console.log("error model getRequestList By Admin :", error);
      return false;
    }
  },

  getAdminRequestCount: async () => {
    try {
      const result = await pool.query(
        `SELECT count(rs.id) as requestCount
      FROM
          request_storage rs`
      );
      //   console.log(result);
      return result[0].requestCount;
    } catch (error) {
      console.log("error model get  count request :", error);
      return false;
    }
  },

  amountAccumulationRegister: async (maintenance_id, datetime, option) => {
    try {
      let nameCondition;
      if (option == "y") {
        nameCondition = "YEAR";
      } else {
        nameCondition = "MONTH";
      }
      const result = await pool.query(
        `SELECT COUNT(rs.id) AS countRequest FROM request_storage rs WHERE rs.maintenance_id = ${maintenance_id} AND ${nameCondition}(rs.created_at)=${datetime};`
      );
      //   console.log(result);
      return result[0].requestCount;
    } catch (error) {
      console.log("error model get amountAccumulationRegister :", error);
      return false;
    }
  },

  amountRequestCompleted: async (maintenance_id, datetime, option) => {
    try {
      let nameCondition;
      if (option == "y") {
        nameCondition = "YEAR";
      } else {
        nameCondition = "MONTH";
      }
      const result = await pool.query(
        `SELECT COUNT(rs.id) AS countRequest FROM request_storage rs WHERE rs.maintenance_id = ${maintenance_id} AND (rs.status_id=4 OR rs.status_id=5) AND ${nameCondition}(rs.created_at)=${datetime};`
      );
      //   console.log(result);
      return result[0].requestCount;
    } catch (error) {
      console.log("error model get  amountRequestCompleted :", error);
      return false;
    }
  },
  amountRequestProcessing: async (maintenance_id, datetime, option) => {
    try {
      let nameCondition;
      if (option == "y") {
        nameCondition = "YEAR";
      } else {
        nameCondition = "MONTH";
      }
      const result = await pool.query(
        `SELECT COUNT(rs.id) AS countRequest FROM request_storage rs WHERE rs.maintenance_id = ${maintenance_id} AND (rs.status_id=2 OR rs.status_id=3) AND ${nameCondition}(rs.created_at)=${datetime};`
      );
      //   console.log(result);
      return result[0].requestCount;
    } catch (error) {
      console.log("error model get  amountRequestProcessing :", error);
      return false;
    }
  },
  amountPerRequestCompleted: async (maintenance_id, dateime, option) => {
    try {
      let nameCondition;
      if (option == "y") {
        nameCondition = "YEAR";
      } else {
        nameCondition = "MONTH";
      }
      const result = await pool.query(
        `SELECT ((COUNT(rs.id)/rs2.countRequest)*100) AS countRequest FROM request_storage rs,
        (SELECT COUNT(rs.id) AS countRequest FROM request_storage rs
        WHERE rs.maintenance_id = ${maintenance_id} AND ${nameCondition}(rs.created_at)=${datetime}) AS rs2
         WHERE rs.maintenance_id = 1 AND (rs.status_id=4 OR rs.status_id=5) AND ${nameCondition}(rs.created_at)=${dateime};`
      );
      //   console.log(result);
      return result[0].requestCount;
    } catch (error) {
      console.log("error model get  amountPerRequestCompleted :", error);
      return false;
    }
  },

  getAllUser: async (role_id, page) => {
    try {
      const numberPage = (page - 1) * 10;
      const result = await pool.query(
        `SELECT u.id, u.name, u.position,u.affiliated_department,u.status_id,us.status_name,u.created_at
      FROM
           users u, account_status us
      WHERE u.status_id=us.id and u.status_id!=1 and  u.role_id=${role_id} ORDER BY u.id asc LIMIT 10 OFFSET ${numberPage}`
      );
      //   console.log(result);
      return result;
    } catch (error) {
      console.log("error model all user :", error);
      return false;
    }
  },

  getUserCount: async (role_id) => {
    try {
      const result = await pool.query(
        `SELECT count(u.id) as userCount
      FROM
           users u
      WHERE u.role_id=${role_id} and u.status_id!=1
           `
      );
      //   console.log(result);
      return result[0].userCount;
    } catch (error) {
      console.log("error model all user :", error);
      return false;
    }
  },
  listUserBySearchText: async (role_id, option, text, page) => {
    try {
      const numberPage = (page - 1) * 10;
      let resutlSearch;
      let resultCount;
      if (!text) {
        resutlSearch = await pool.query(
          `SELECT u.id, u.name, u.position,u.affiliated_department,u.status_id,us.status_name,u.created_at
      FROM
           users u, account_status us
      WHERE u.status_id=us.id and u.status_id!=1 and u.role_id=${role_id} ORDER BY u.id asc LIMIT 10 OFFSET ${numberPage}`
        );
        resultCount = await pool.query(
          `SELECT count(u.id) as userCount
      FROM
           users u
      WHERE u.role_id=${role_id} and u.status_id!=1`
        );
      }

      // search
      else if (text) {
        let nameCondition = "u.name";
        if (option == 1) {
          nameCondition = "u.name";
        } else if (option == 2) {
          nameCondition = "u.position";
        } else if (option == 3) {
          nameCondition = "u.affiliated_department";
        } else if (option == 4) {
          nameCondition = "us.status_name";
        }

        resutlSearch = await pool.query(
          `SELECT u.id, u.name, u.position,u.affiliated_department,u.status_id,us.status_name,u.created_at FROM users u, account_status us
      WHERE u.status_id=us.id and u.status_id!=1 and u.role_id=${role_id} and ${nameCondition} like "%${text}%" ORDER BY u.id asc LIMIT 10 OFFSET ${numberPage}`
        );
        resultCount = await pool.query(
          `SELECT u.id, u.name, u.position,u.affiliated_department,u.status_id,us.status_name,u.created_at FROM users u, account_status us
      WHERE u.status_id=us.id and u.status_id!=1 and u.role_id=${role_id} and ${nameCondition} like "%${text}%"`
        );
      }

      return {
        listFilter: resutlSearch,
        requestCount: resultCount.length,
      };
    } catch (error) {
      console.log("error model getRequestList By Search :", error);
      return false;
    }
  },
  adminGetAccountStatus: async () => {
    try {
      const result = await pool.query(
        `SELECT id,status_name
      FROM
           account_status
           `
      );
      return result;
    } catch (error) {
      console.log("error model account status :", error);
      return false;
    }
  },

  adminGetUserInfor: async (user_id) => {
    try {
      const result = await pool.query(
        `SELECT users.id,users.name,affiliated_department,email,roles.name as leveluser,position,phone_number,tel_number, users.status_id FROM users,roles WHERE users.id=${user_id} and users.role_id= roles.id;`
      );
      return result[0];
    } catch (error) {
      console.log("error model get user infor:", error);
      return false;
    }
  },

  updateUserStatus: async (user_id, status_id) => {
    try {
      result = await pool.query(
        `update users set 
          status_id="${status_id}"
          where id="${user_id}";`
      );

      return result;
    } catch (error) {
      console.log("error model UpdateUserStatus:", error);
      return false;
    }
  },
  deleteUser: async (user_id) => {
    try {
      result = await pool.query(`DELETE FROM users WHERE id= "${user_id}"`);
      return result;
    } catch (error) {
      console.log("error model Delete user :", error);
      return false;
    }
  },

  getAllHelper: async (page) => {
    try {
      const numberPage = (page - 1) * 10;
      const result = await pool.query(
        `SELECT u.id, u.name, u.position,u.affiliated_department,u.status_id,us.status_name,u.created_at
      FROM
           users u, account_status us
      WHERE u.status_id=us.id and u.status_id!=1 and  (u.role_id=1 or u.role_id=2) ORDER BY u.id asc LIMIT 10 OFFSET ${numberPage}`
      );
      //   console.log(result);
      return result;
    } catch (error) {
      console.log("error model all helper :", error);
      return false;
    }
  },

  getHelperCount: async () => {
    try {
      const result = await pool.query(
        `SELECT count(u.id) as userCount
      FROM
           users u
      WHERE (u.role_id=1 or u.role_id=2) and u.status_id!=1
           `
      );
      //   console.log(result);
      return result[0].userCount;
    } catch (error) {
      console.log("error model get Count helper :", error);
      return false;
    }
  },
  listHelperBySearchText: async (option, text, page) => {
    try {
      const numberPage = (page - 1) * 10;
      let resutlSearch;
      let resultCount;
      if (!text) {
        resutlSearch = await pool.query(
          `SELECT u.id, u.name, u.position,u.affiliated_department,u.status_id,us.status_name,u.created_at
      FROM
           users u, account_status us
      WHERE u.status_id=us.id and u.status_id!=1 and (u.role_id=1 or u.role_id=2) and ORDER BY u.id asc LIMIT 10 OFFSET ${numberPage}`
        );
        resultCount = await pool.query(
          `SELECT count(u.id) as userCount
      FROM
           users u
      WHERE (u.role_id=1 or u.role_id=2)  and u.status_id!=1`
        );
      }

      // search
      else if (text) {
        let nameCondition = "u.name";
        if (option == 1) {
          nameCondition = "u.name";
        } else if (option == 2) {
          nameCondition = "u.position";
        } else if (option == 3) {
          nameCondition = "u.affiliated_department";
        } else if (option == 4) {
          nameCondition = "us.status_name";
        }

        resutlSearch = await pool.query(
          `SELECT u.id, u.name, u.position,u.affiliated_department,u.status_id,us.status_name,u.created_at FROM users u, account_status us
      WHERE u.status_id=us.id and u.status_id!=1 and (u.role_id=1 or u.role_id=2) and ${nameCondition} like "%${text}%" ORDER BY u.id asc LIMIT 10 OFFSET ${numberPage}`
        );
        resultCount = await pool.query(
          `SELECT u.id, u.name, u.position,u.affiliated_department,u.status_id,us.status_name,u.created_at FROM users u, account_status us
      WHERE u.status_id=us.id and u.status_id!=1 and (u.role_id=1 or u.role_id=2) and ${nameCondition} like "%${text}%"`
        );
      }

      return {
        listFilter: resutlSearch,
        requestCount: resultCount.length,
      };
    } catch (error) {
      console.log("error model get list helper by search By Admin :", error);
      return false;
    }
  },

  getAllCompany: async (page) => {
    try {
      const numberPage = (page - 1) * 10;
      const result = await pool.query(
        `SELECT id, name_company,fax,phone_number,business_code
           from company
       ORDER BY id asc LIMIT 10 OFFSET ${numberPage}`
      );
      //   console.log(result);
      return result;
    } catch (error) {
      console.log("error model all company  :", error);
      return false;
    }
  },

  getCompanyrCount: async () => {
    try {
      const result = await pool.query(
        `SELECT id, name_company,fax,phone_number,business_code
           from company`
      );
      //   console.log(result);
      return result[0].userCount;
    } catch (error) {
      console.log("error model count company :", error);
      return false;
    }
  },
  listCompanyBySearchText: async (option, text, page) => {
    try {
      const numberPage = (page - 1) * 10;
      let resutlSearch;
      let resultCount;
      if (!text) {
        resutlSearch = await pool.query(
          `SELECT id, name_company,fax,phone_number,business_code
           from company
       ORDER BY id asc LIMIT 10 OFFSET ${numberPage}`
        );
        resultCount = await pool.query(
          `SELECT id, name_company,fax,phone_number,business_code
           from company`
        );
      }

      // search
      else if (text) {
        let nameCondition = "name_company";
        if (option == 1) {
          nameCondition = "name_company";
        } else if (option == 2) {
          nameCondition = "business_code";
        } else if (option == 3) {
          nameCondition = "phone_number";
        } else if (option == 4) {
          nameCondition = "fax";
        }

        resutlSearch = await pool.query(
          `SELECT id, name_company,fax,phone_number,business_code
           from company
           WHERE ${nameCondition} like "%${text}%"
       ORDER BY id asc LIMIT 10 OFFSET ${numberPage}`
        );
        resultCount = await pool.query(
          `SELECT id, name_company,fax,phone_number,business_code
           from company
           WHERE ${nameCondition} like "%${text}%"`
        );
      }

      return {
        listFilter: resutlSearch,
        requestCount: resultCount.length,
      };
    } catch (error) {
      console.log("error model Company By Search :", error);
      return false;
    }
  },

  registerHelper: async (data) => {
    try {
      const result = await pool.query(
        "insert into users (id,password,name,company_id,email,role_id,tel_number,phone_number,position,status_id) values (?,?,?,?,?,?,?,?,?,?)",
        [
          data.id,
          data.password,
          data.name,
          data.company_id,
          data.email,
          data.role_id,
          data.tel_number,
          data.phone_number,
          data.position,
          data.status_id,
        ]
      );
      // console.log(result)
      if (result) {
        return { message: "Registered helper Successfully", status: true };
      }
      //    console.log("resssssssssssssssssss",result);
    } catch (error) {
      console.log("error model helper register:", error);
      return false;
    }
  },
};
