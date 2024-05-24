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
      WHERE u.status_id=us.id and u.status_id != 1 and  u.role_id=${role_id} ORDER BY u.id asc LIMIT 10 OFFSET ${numberPage}`
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
        `SELECT users.id,users.name,affiliated_department,email,roles.name as leveluser,roles.id as role_id,position,phone_number,tel_number, users.status_id FROM users,roles WHERE users.id=${user_id} and users.role_id= roles.id;`
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

  getAllCompanyToAddInfor: async (page) => {
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

  getCompanyrCountToAddInfor: async () => {
    try {
      const result = await pool.query(
        `SELECT count(id) as companyCount
           from company`
      );
      //   console.log(result);
      return result[0].companyCount;
    } catch (error) {
      console.log("error model count company :", error);
      return false;
    }
  },
  listCompanyBySearchTextToAddInfor: async (option, text, page) => {
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

  updateHelperInfor: async (user_id, data) => {
    try {
      result = await pool.query(
        `update users set 
          company_id="${data.company_id}",
          email="${data.email}",
          role_id="${data.role_id}",
          status_id="${data.status_id}",
          position="${data.position}",
          phone_number="${data.phone_number}",
          tel_number="${data.tel_number}"
          where id="${user_id}";`
      );

      return result;
    } catch (error) {
      console.log("error model UpdateUserStatus:", error);
      return false;
    }
  },

  checkCompanyName: async (name_company) => {
    try {
      const resultCheck = await pool.query(
        `select * from company where name_company ="${name_company}"`
      );
      let result =
        resultCheck.length > 0
          ? { status: false, message: "Company name is exist" }
          : { status: true, message: "Company name valid" };
      return result;
    } catch (error) {
      console.log("error model checked name company By Admin :", error);
      return false;
    }
  },

  getAllCompanyToWatch: async (page) => {
    try {
      const numberPage = (page - 1) * 10;
      const result = await pool.query(
        `SELECT c.id,c.name_company,c.business_code, COUNT(u.id) as amountHelper,c.created_at
         FROM company c left JOIN users u ON c.id=u.company_id GROUP BY c.id  LIMIT 10 OFFSET ${numberPage}`
      );

      return result;
    } catch (error) {
      console.log("error model all company :", error);
      return false;
    }
  },

  getCompanyCountToWatch: async () => {
    try {
      const result = await pool.query(
        `SELECT count(company.id) as companyCount
         FROM company `
      );
      //   console.log(result);
      return result[0].companyCount;
    } catch (error) {
      console.log("error model get company count :", error);
      return false;
    }
  },
  listUserBySearchTextToWatch: async (option, text, page) => {
    try {
      const numberPage = (page - 1) * 10;
      let resutlSearch;
      let resultCount;
      if (!text) {
        resutlSearch = await pool.query(
          `SELECT c.id,c.name_company,c.business_code, COUNT(u.id) amountHelper,c.created_at
         FROM company c left JOIN users u ON c.id=u.company_id GROUP BY c.id  LIMIT 10 OFFSET ${numberPage}`
        );
        resultCount = await pool.query(
          `SELECT count(company.id) as companyCount
         FROM company `
        );
      }

      // search
      else if (text) {
        let nameCondition = "c.name_company";
        if (option == 1) {
          nameCondition = "c.name_company";
        } else if (option == 2) {
          nameCondition = "c.business_code";
        }
        // else if (option == 3) {
        //   nameCondition = "u.affiliated_department";
        // } else if (option == 4) {
        //   nameCondition = "us.status_name";
        // }

        resutlSearch = await pool.query(
          `SELECT c.id,c.name_company,c.business_code, COUNT(u.id),c.created_at
         FROM company c left JOIN users u ON c.id=u.company_id
          where ${nameCondition}="${text}"
          GROUP BY c.id  LIMIT 10 OFFSET ${numberPage}`
        );
        resultCount = await pool.query(
          `SELECT c.id,c.name_company,c.business_code, COUNT(u.id),c.created_at
         FROM company c left JOIN users u ON c.id=u.company_id
          where ${nameCondition}="${text}"`
        );
      }

      return {
        listFilter: resutlSearch,
        requestCount: resultCount.length,
      };
    } catch (error) {
      console.log("error model get Company By Search :", error);
      return false;
    }
  },

  registerCompany: async (data) => {
    try {
      const result = await pool.query(
        "insert into company (name_company,fax,phone_number,business_code) values (?,?,?,?)",
        [data.name_company, data.fax, data.phone_number, data.business_code]
      );
      // console.log(result)
      if (result) {
        return { message: "Registered company Successfully", status: true };
      }
      //    console.log("resssssssssssssssssss",result);
    } catch (error) {
      console.log("error model comapny register:", error);
      return false;
    }
  },
  getCompanyInforById: async (company_id) => {
    try {
      const result = await pool.query(
        `SELECT name_company,fax,phone_number,business_code
      FROM
           company
      WHERE id = ${company_id}
           `
      );
      //   console.log(result);
      return result[0];
    } catch (error) {
      console.log("error model get companyInfor :", error);
      return false;
    }
  },
  updateCompanyInfor: async (data) => {
    try {
      const result = await pool.query(
        "update  company set name_company=?, fax=?, phone_number=?, business_code=? where id =?",
        [
          data.name_company,
          data.fax,
          data.phone_number,
          data.business_code,
          data.company_id,
        ]
      );
      // console.log(result)
      if (result) {
        return { message: "update company infor Successfully", status: true };
      }
      //    console.log("resssssssssssssssssss",result);
    } catch (error) {
      console.log("error model comapny company infor:", error);
      return false;
    }
  },

  deleteCompany: async (company_id) => {
    try {
      result = await pool.query(
        `DELETE FROM company WHERE id= "${company_id}"`
      );
      return result;
    } catch (error) {
      console.log("error model Delete company :", error);
      return false;
    }
  },

  getAllUserWaitAccept: async (role_id, page) => {
    try {
      const numberPage = (page - 1) * 10;
      const result = await pool.query(
        `SELECT u.id, u.name, u.position,u.affiliated_department,u.status_id,us.status_name,u.created_at
      FROM
           users u, account_status us
      WHERE u.status_id=us.id and (u.status_id = 1 or u.status_id = 3) and  u.role_id=${role_id} ORDER BY u.id asc LIMIT 10 OFFSET ${numberPage}`
      );
      //   console.log(result);
      return result;
    } catch (error) {
      console.log("error model all user wait accept :", error);
      return false;
    }
  },

  getUserCountWaitAccept: async (role_id) => {
    try {
      const result = await pool.query(
        `SELECT count(u.id) as userCount
      FROM
           users u
      WHERE u.role_id=${role_id} and (u.status_id = 1 or u.status_id = 3)
           `
      );
      //   console.log(result);
      return result[0].userCount;
    } catch (error) {
      console.log("error model all user wait accept:", error);
      return false;
    }
  },
  listUserWaitAcceptBySearchText: async (role_id, option, text, page) => {
    try {
      const numberPage = (page - 1) * 10;
      let resutlSearch;
      let resultCount;
      if (!text) {
        resutlSearch = await pool.query(
          `SELECT u.id, u.name, u.position,u.affiliated_department,u.status_id,us.status_name,u.created_at
      FROM
           users u, account_status us
      WHERE u.status_id=us.id and (u.status_id = 1 or u.status_id = 3) and u.role_id=${role_id} ORDER BY u.id asc LIMIT 10 OFFSET ${numberPage}`
        );
        resultCount = await pool.query(
          `SELECT count(u.id) as userCount
      FROM
           users u
      WHERE u.role_id=${role_id} and (u.status_id = 1 or u.status_id = 3)`
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
      WHERE u.status_id=us.id and (u.status_id = 1 or u.status_id = 3) and u.role_id=${role_id} and ${nameCondition} like "%${text}%" ORDER BY u.id asc LIMIT 10 OFFSET ${numberPage}`
        );
        resultCount = await pool.query(
          `SELECT u.id, u.name, u.position,u.affiliated_department,u.status_id,us.status_name,u.created_at FROM users u, account_status us
      WHERE u.status_id=us.id and (u.status_id = 1 or u.status_id = 3) and u.role_id=${role_id} and ${nameCondition} like "%${text}%"`
        );
      }

      return {
        listFilter: resutlSearch,
        requestCount: resultCount.length,
      };
    } catch (error) {
      console.log("error model wait accept By Search :", error);
      return false;
    }
  },

  updateLabelName: async (label_id, name) => {
    try {
      result = await pool.query(
        `update list_label set 
          label_name="${name}"
          where id="${label_id}";`
      );

      return result;
    } catch (error) {
      console.log("error model UpdateUserStatus:", error);
      return false;
    }
  },

  addNameLabel: async (name) => {
    try {
      const result = await pool.query(
        "insert into list_label (label_name) values (?)",
        [name]
      );
      // console.log(result)
      if (result) {
        return { message: "Registered name label Successfully", status: true };
      }
      //    console.log("resssssssssssssssssss",result);
    } catch (error) {
      console.log("error model name label register:", error);
      return false;
    }
  },

  getListLabel: async () => {
    try {
      const result = await pool.query(
        `SELECT id, label_name
      FROM
           list_label
        ORDER BY created_at desc LIMIT 12`
      );
      //   console.log(result);
      return result;
    } catch (error) {
      console.log("error model get list label :", error);
      return false;
    }
  },
  listLabelBySearchText: async (text) => {
    try {
      let resutlSearch;

      if (!text) {
        resutlSearch = await pool.query(
          `SELECT id, label_name
      FROM
           list_label
        ORDER BY created_at desc LIMIT 12`
        );
      }

      // search
      else if (text) {
        resutlSearch = await pool.query(
          `SELECT id, label_name
      FROM
           list_label
      WHERE label_name like "%${text}%"  ORDER BY created_at asc LIMIT 12`
        );
      }

      return resutlSearch;
    } catch (error) {
      console.log("error model get list label By Search :", error);
      return false;
    }
  },
  // ///////
  checkExistLabelId: async (maintenance_id, label_id) => {
    try {
      const resultCheck = await pool.query(
        `select * from maintenance_class where maintenance_id=${maintenance_id} and list_label_id ="${label_id}"`
      );
      let result =
        resultCheck.length > 0
          ? { status: false, message: "list_label_id is exist" }
          : { status: true, message: "list_label_id is valid" };
      return result;
    } catch (error) {
      console.log("error model checked checkExistLabelId By Admin :", error);
      return false;
    }
  },
  UpdateLabelToMainClass: async (maintenance_class_id, list_label_id) => {
    try {
      const result = await pool.query(
        "update maintenance_class set list_label_id=? where id=?",
        [maintenance_class_id, list_label_id]
      );
      // console.log(result)
      if (result) {
        return {
          message: "Update label in mainClass Successfully",
          status: true,
        };
      }
      //    console.log("resssssssssssssssssss",result);
    } catch (error) {
      console.log("error model Update label in mainClass:", error);
      return false;
    }
  },
};
