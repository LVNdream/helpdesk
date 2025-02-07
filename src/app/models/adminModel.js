const { pool } = require("../../config/db");
const bcrypt = require("bcryptjs");
const helperModel = require("./helperModel");

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
left JOIN 
    maintenance_type mt ON rs.maintenance_id = mt.id
JOIN 
    request_status rstt ON rs.status_id = rstt.id
JOIN 
    users ON rs.petitioner_id = users.id
LEFT JOIN 
    users AS users2 ON rs.recipient_id = users2.id, method mth
WHERE 
     mth.id=rs.method_id ORDER BY rs.updated_at desc LIMIT 10 OFFSET ${numberPage};`
      );
      // console.log(result);
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
      const startNumber = (page - 1) * 10;
      const endNumber = page * 10;

      let resutlSearch;
      let resultNoLimit;
      // init
      if (role_id == 3) {
        resutlSearch = await pool.query(
          `SELECT DISTINCT rs.id,rs.title_request,mt.type_name,rs.status_id, users.name AS petitioner,rs.petitioner_id,rs.recipient_id,
            users2.name AS recipient,rs.maintenance_id,rs.created_at,rs.completion_date ,mth.method_name
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
                mth.id=rs.method_id ORDER BY rs.updated_at desc  ;`
        );
        resultNoLimit = await pool.query(
          `SELECT DISTINCT rs.id,rs.title_request,mt.type_name,rs.status_id, users.name AS petitioner,rs.petitioner_id,rs.recipient_id,
            users2.name AS recipient,rs.maintenance_id,rs.created_at,rs.completion_date ,mth.method_name
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
                mth.id=rs.method_id;`
        );
      } else if (role_id == 4) {
        resutlSearch = await pool.query(
          `SELECT DISTINCT rs.id,rs.title_request,mt.type_name,rs.status_id, users.name AS petitioner,rs.petitioner_id,rs.recipient_id,
            users2.name AS recipient,rs.maintenance_id,rs.created_at,rs.completion_date ,mth.method_name
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
                mth.id=rs.method_id and rs.petitioner_id=${user_id} ORDER BY rs.updated_at desc  ;`
        );
        resultNoLimit = await pool.query(
          `SELECT DISTINCT rs.id,rs.title_request,mt.type_name,rs.status_id, users.name AS petitioner,rs.petitioner_id,rs.recipient_id,rs.maintenance_id,
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
                mth.id=rs.method_id and rs.petitioner_id=${user_id} ;`
        );
      } else if (role_id == 1 || role_id == 2) {
        resutlSearch = await pool.query(
          `SELECT DISTINCT rs.id,rs.title_request,mt.type_name,rs.status_id, users.name AS petitioner,rs.petitioner_id,rs.recipient_id,
            users2.name AS recipient,rs.maintenance_id,rs.created_at,rs.completion_date ,mth.method_name
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
                mth.id=rs.method_id and (rs.maintenance_id = ${role_id} or rs.maintenance_id is null ) and (rs.status_id = 1 or rs.recipient_id = "${user_id}") ORDER BY rs.updated_at desc ;`
        );
        resultNoLimit = await pool.query(
          `SELECT DISTINCT rs.id,rs.title_request,mt.type_name,rs.status_id, users.name AS petitioner,rs.petitioner_id,rs.recipient_id,rs.maintenance_id,
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
                mth.id=rs.method_id and (rs.maintenance_id = ${role_id} or rs.maintenance_id is null ) and (rs.status_id = 1 or rs.recipient_id = "${user_id}");`
        );
      }

      // search
      if (status_id && Number(status_id) && !text) {
        const result = await pool.query(
          `SELECT DISTINCT rs.id,rs.title_request,mt.type_name,rs.status_id, users.name AS petitioner,rs.petitioner_id,rs.recipient_id,
            users2.name AS recipient,rs.maintenance_id,rs.created_at,rs.completion_date ,mth.method_name
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
                mth.id=rs.method_id and  rs.status_id = ${status_id} ORDER BY rs.updated_at desc ;`
        );
        resutlSearch = result;
        resultNoLimit = await pool.query(
          `SELECT DISTINCT rs.id,rs.title_request,mt.type_name,rs.status_id, users.name AS petitioner,rs.petitioner_id,rs.recipient_id,rs.maintenance_id,
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
                mth.id=rs.method_id and  rs.status_id = ${status_id} ;`
        );
      } else if (text && !Number(status_id)) {
        let nameCondition =
          role_id == 1 || role_id == 2 ? "users.name" : "rs.title_request";
        if (option == 1) {
          nameCondition = "rs.title_request";
        } else if (option == 2) {
          nameCondition = "mt.type_name";
        } else if (option == 3) {
          nameCondition = "users.name";
        } else if (option == 4) {
          nameCondition = "users2.name";
        } else {
          nameCondition =
            role_id == 1 || role_id == 2 ? "users.name" : "rs.title_request";
        }
        const result = await pool.query(
          `SELECT DISTINCT rs.id,rs.title_request,mt.type_name,rs.status_id, users.name AS petitioner,rs.petitioner_id,rs.recipient_id,
            users2.name AS recipient,rs.maintenance_id,rs.created_at,rs.completion_date ,mth.method_name
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
                mth.id=rs.method_id and  ${nameCondition} LIKE "%${text}%" ORDER BY rs.updated_at desc ;`
        );
        resutlSearch = result;
        resultNoLimit = await pool.query(
          `SELECT DISTINCT rs.id,rs.title_request,mt.type_name,rs.status_id, users.name AS petitioner,rs.petitioner_id,rs.recipient_id,rs.maintenance_id,
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
                mth.id=rs.method_id and  ${nameCondition} LIKE "%${text}%";`
        );
      } else if (status_id && text) {
        let nameCondition =
          role_id == 1 || role_id == 2 ? "users.name" : "rs.title_request";
        if (option == 1) {
          nameCondition = "rs.title_request";
        } else if (option == 2) {
          nameCondition = "mt.type_name";
        } else if (option == 3) {
          nameCondition = "users.name";
        } else if (option == 4) {
          nameCondition = "users2.name";
        } else {
          nameCondition =
            role_id == 1 || role_id == 2 ? "users.name" : "rs.title_request";
        }

        const result = await pool.query(
          `SELECT DISTINCT rs.id,rs.title_request,mt.type_name,rs.status_id, users.name AS petitioner,rs.petitioner_id,rs.recipient_id,
            users2.name AS recipient,rs.maintenance_id,rs.created_at,rs.completion_date ,mth.method_name
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
                mth.id=rs.method_id and rs.status_id=${status_id} and ${nameCondition} LIKE "%${text}%" ORDER BY rs.updated_at desc ;`
        );
        resutlSearch = result;
        resultNoLimit = await pool.query(
          `SELECT DISTINCT rs.id,rs.title_request,mt.type_name,rs.status_id, users.name AS petitioner,rs.petitioner_id,rs.recipient_id,rs.maintenance_id,
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
                mth.id=rs.method_id and rs.status_id=${status_id} and ${nameCondition} LIKE "%${text}%";`
        );
      }

      // console.log(1231231231231233123,resutlSearch)
      let resultByRoleById;
      let requestToCount;
      if (role_id == 3) {
        resultByRoleById = resutlSearch;
        requestToCount = resultNoLimit;
      } else if (role_id == 4) {
        resultByRoleById = resutlSearch.filter((data) => {
          return data.petitioner_id == user_id;
        });
        requestToCount = resultNoLimit.filter((data) => {
          return data.petitioner_id == user_id;
        });
      } else if (role_id == 1 || role_id == 2) {
        resultByRoleById = resutlSearch.filter((data) => {
          return (
            (data.maintenance_id == role_id || data.maintenance_id === null) &&
            (data.status_id == 1 || data.recipient_id == user_id)
          );
        });
        requestToCount = resultNoLimit.filter((data) => {
          return (
            (data.maintenance_id == role_id || data.maintenance_id === null) &&
            (data.status_id == 1 || data.recipient_id == user_id)
          );
        });
      } else if (role_id == 5) {
        resultByRoleById = resutlSearch.filter((data) => {
          // console.log(data)
          return (
            (data.maintenance_id == 1 || data.maintenance_id == 2 || data.maintenance_id == null) &&
            (data.status_id == 1 || data.recipient_id == user_id)
          );
        });
        requestToCount = resultNoLimit.filter((data) => {
          return (
            (data.maintenance_id == 1 || data.maintenance_id == 2 || data.maintenance_id == null) &&
            (data.status_id == 1 || data.recipient_id == user_id)
          );
        });
      }
      let listPagination = [];
      // console.log(resultByRoleById)
      for (let i = startNumber; i < endNumber; i++) {
        const item = resultByRoleById[i];
        // console.log(item)
        if (item) {
          listPagination.push(item);
        }
      }
      // console.log(startNumber, endNumber)
      // console.log(listPagination);

      return {
        listFilter: listPagination,
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

  getAllUser: async (role_id, page) => {
    try {
      const numberPage = (page - 1) * 10;
      const result = await pool.query(
        `SELECT u.id,u.account, u.name, u.position,u.affiliated_department,u.status_id,us.status_name,u.created_at,u.tel_number,u.phone_number,u.email,"일반사용자" as leveluser
      FROM
           users u left join  account_status us on u.status_id=us.id left join roles r on r.id=u.role_id
      WHERE  (u.status_id != 1 and u.status_id != 3) and  u.role_id=${role_id}   ORDER BY u.created_at desc LIMIT 10 OFFSET ${numberPage}`
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
      WHERE u.role_id=${role_id} and (u.status_id != 1 and u.status_id != 3)
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
          `SELECT u.id,u.account, u.name, u.position,u.affiliated_department,u.status_id,us.status_name,u.created_at,u.tel_number,u.phone_number,u.email
      FROM
           users u left join account_status us on u.status_id=us.id
      WHERE (u.status_id != 1 and u.status_id != 3) and u.role_id=${role_id} ORDER BY u.created_at desc LIMIT 10 OFFSET ${numberPage}`
        );
        resultCount = await pool.query(
          `SELECT u.id,u.account, u.name, u.position,u.affiliated_department,u.status_id,us.status_name,u.created_at
      FROM
           users u left join account_status us on u.status_id=us.id
      WHERE  (u.status_id != 1 and u.status_id != 3) and u.role_id=${role_id} ORDER BY u.created_at desc`
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
          nameCondition = "us.status_name";
        } else if (option == 6) {
          nameCondition = "u.account";
        } else {
          nameCondition = "u.account";
        }

        resutlSearch = await pool.query(
          `SELECT u.id,u.account, u.name, u.position,u.affiliated_department,u.status_id,us.status_name,u.created_at,u.tel_number,u.phone_number,u.email
          FROM users u left join account_status us on u.status_id=us.id
      WHERE  (u.status_id != 1 and u.status_id != 3) and u.role_id=${role_id} and ${nameCondition} like "%${text}%" ORDER BY u.created_at desc LIMIT 10 OFFSET ${numberPage}`
        );
        resultCount = await pool.query(
          `SELECT u.id, u.name, u.position,u.affiliated_department,u.status_id,us.status_name,u.created_at
          FROM users u left join account_status us on u.status_id=us.id
      WHERE  (u.status_id != 1 and u.status_id != 3) and u.role_id=${role_id} and ${nameCondition} like "%${text}%"`
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
      // co sua thi mo len, chi lay 2 trang thai
      // where id=2 or id=4
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
  adminGetAccountStatusWaitAccept: async () => {
    try {
      const result = await pool.query(
        `SELECT id,status_name
      FROM
           account_status
           where id=1 or id=2 or id =3
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
        `SELECT u.id,u.name,u.account,u.affiliated_department,u.email,"일반사용자" as leveluser,r.id as role_id,u.position,u.phone_number,u.tel_number, u.status_id,us.status_name,u.reset_password
         FROM users u left join roles r on u.role_id = r.id left join account_status us on us.id=u.status_id WHERE u.id=${user_id} and u.role_id= r.id;`
      );
      return result[0];
    } catch (error) {
      console.log("error model get user infor:", error);
      return false;
    }
  },

  adminGetHelperInfor: async (user_id) => {
    try {
      const result = await pool.query(
        `SELECT users.id,users.name,users.account,company.name_company as company_name,company.id as company_id,email,"헬프데스크 담당자" as leveluser,roles.id as role_id,position,users.phone_number,users.tel_number, users.status_id 
        FROM
        users
        left join roles  on  users.role_id= roles.id
        left join company  on company.id=users.company_id
        WHERE  users.id=${user_id};`
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

      return result.affectedRows > 0 ? result : false;
    } catch (error) {
      console.log("error model UpdateUserStatus:", error);
      return false;
    }
  },
  AdminUpdateUserInfor: async (data) => {
    try {
      // reset password
      let result;
      if (!data.password) {
        result = await pool.query(
          `update users set 
          status_id="${data.status_id}",
          email="${data.email}",
          tel_number="${data.tel_number}",
          phone_number="${data.phone_number}",
          position="${data.position}",
          affiliated_department="${data.affiliated_department}"
          where id="${data.user_id}";`
        );
      } else {
        const password_hash = bcrypt.hashSync(data.password, 8);
        result = await pool.query(
          `update users set 
          status_id="${data.status_id}",
          email="${data.email}",
          tel_number="${data.tel_number}",
          phone_number="${data.phone_number}",
          position="${data.position}",
          affiliated_department="${data.affiliated_department}",
          password="${password_hash}"
          where id="${data.user_id}";`
        );
      }

      return result.affectedRows > 0 ? result : false;
    } catch (error) {
      console.log("error model AdminUpdateUserInfor:", error);
      return false;
    }
  },

  deleteUser: async (user_id) => {
    try {
      result = await pool.query(`DELETE FROM users WHERE id= "${user_id}"`);
      return result.affectedRows > 0 ? result : false;
    } catch (error) {
      console.log("error model Delete user :", error);
      return false;
    }
  },

  getAllHelper: async (page) => {
    try {
      const numberPage = (page - 1) * 10;
      const result = await pool.query(
        `SELECT u.id,u.account, u.name, c.name_company,"헬프데스크 담당자" as main_type,u.status_id,us.status_name,u.created_at
      FROM
           users u
            left join account_status us on u.status_id=us.id
            left join roles r on u.role_id= r.id
            left join company c on u.company_id= c.id

      WHERE   u.status_id!=1 and u.status_id!=3 and  (u.role_id=1 or u.role_id=2 or u.role_id=5) ORDER BY u.created_at desc LIMIT 10 OFFSET ${numberPage}`
      );
      // console.log(result);
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
      WHERE (u.role_id=1 or u.role_id=2 or u.role_id=5) and u.status_id!=1 and u.status_id!=3
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
          `SELECT u.id,u.account, u.name, c.name_company,"헬프데스크 담당자" as main_type,u.status_id,us.status_name,u.created_at
      FROM
           users u
            left join account_status us on u.status_id=us.id
            left join roles r on u.role_id= r.id
            left join company c on u.company_id= c.id
      WHERE  u.status_id!=1 and u.status_id!=3  and (u.role_id=1 or u.role_id=2 or u.role_id=5)  ORDER BY u.created_at desc LIMIT 10 OFFSET ${numberPage}`
        );
        resultCount = await pool.query(
          `SELECT *
      FROM
           users u
      WHERE (u.role_id=1 or u.role_id=2 or u.role_id=5)  and u.status_id=2`
        );
      }

      // search
      else if (text) {
        let nameCondition = "u.account";
        if (option == 1) {
          nameCondition = "u.account";
        } else if (option == 2) {
          nameCondition = "u.name";
        } else if (option == 3) {
          nameCondition = "c.name_company";
        } else if (option == 4) {
          "사용가능".includes(text) ? (text = "정상") : "";
          nameCondition = "us.status_name";
        } else {
          nameCondition = "u.account";
        }

        resutlSearch = await pool.query(
          `SELECT u.id, u.account,u.name, c.name_company,"헬프데스크 담당자" as main_type,u.status_id,us.status_name,u.created_at
           FROM users u
           left join account_status us on u.status_id=us.id
           left join  roles r on u.role_id = r.id
           left join company c on u.company_id = c.id
      WHERE  u.status_id!=1 and u.status_id!=3 and (u.role_id=1 or u.role_id=2 or u.role_id=5) and ${nameCondition} like "%${text}%" ORDER BY u.created_at desc LIMIT 10 OFFSET ${numberPage}`
        );
        resultCount = await pool.query(
          `SELECT u.id, u.name, u.position,u.affiliated_department,u.status_id,us.status_name,u.created_at FROM users u
           left join account_status us on u.status_id=us.id
           left join  roles r on u.role_id = r.id
           left join company c on u.company_id = c.id
      WHERE u.status_id=us.id and u.status_id!=1 and u.status_id!=3 and (u.role_id=1 or u.role_id=2 or u.role_id=5) and ${nameCondition} like "%${text}%"`
        );
        // console.log(nameCondition);
      }

      // console.log(resutlSearch)
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
       ORDER BY created_at desc LIMIT 10 OFFSET ${numberPage}`
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
           from company ORDER BY  created_at DESC `
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
       ORDER BY created_at desc LIMIT 10 OFFSET ${numberPage}`
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
       ORDER BY created_at desc LIMIT 10 OFFSET ${numberPage}`
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
        "insert into users (account,password,name,company_id,email,role_id,tel_number,phone_number,position,status_id) values (?,?,?,?,?,?,?,?,?,?)",
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
        return result;
      }
      //    console.log("resssssssssssssssssss",result);
    } catch (error) {
      console.log("error model helper register:", error);
      return false;
    }
  },

  updateHelperInfor: async (user_id, data) => {
    try {
      const result = await pool.query(
        `update users set 
          email="${data.email}",
          status_id="${data.status_id}",
          company_id="${data.company_id}",
          position="${data.position}",
          phone_number="${data.phone_number}",
          role_id="${data.role_id}",

          tel_number="${data.tel_number}"
          where id="${user_id}";`
      );

      return result.affectedRows > 0 ? result : false;
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
        `SELECT c.id,c.name_company,c.business_code, COUNT(u.id) as amountHelper,c.created_at, u2.name as creator
         FROM company c
         left JOIN users u ON c.id=u.company_id
         left join users u2 on c.creator_id=u2.id
          GROUP BY c.id ORDER BY  c.created_at DESC   LIMIT 10 OFFSET ${numberPage}`
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
  listCompanyBySearchTextToWatch: async (option, text, page) => {
    try {
      const numberPage = (page - 1) * 10;
      let resutlSearch;
      let resultCount;
      if (!text) {
        resutlSearch = await pool.query(
          `SELECT c.id,c.name_company,c.business_code, COUNT(u.id) as amountHelper,c.created_at,u2.name as creator
         FROM company c
         left JOIN users u ON c.id=u.company_id
        left join users u2 on c.creator_id=u2.id
         GROUP BY c.id ORDER BY c.created_at DESC  LIMIT 10 OFFSET ${numberPage}`
        );
        resultCount = await pool.query(
          `SELECT *
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

        resutlSearch = await pool.query(
          `SELECT c.id,c.name_company,c.business_code, COUNT(u.id) as amountHelper,c.created_at
         FROM company c left JOIN users u ON c.id=u.company_id
          where ${nameCondition} like "%${text}%"
          GROUP BY c.id ORDER BY c.created_at DESC LIMIT 10 OFFSET ${numberPage}`
        );
        resultCount = await pool.query(
          `SELECT c.id,c.name_company,c.business_code, COUNT(u.id),c.created_at
         FROM company c left JOIN users u ON c.id=u.company_id
          where ${nameCondition} like "%${text}%" GROUP BY c.id ORDER BY c.created_at DESC `
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
        "insert into company (name_company,fax,phone_number,business_code,creator_id) values (?,?,?,?,?)",
        [
          data.name_company,
          data.fax,
          data.phone_number,
          data.business_code,
          data.creator_id,
        ]
      );

      if (result) {
        return result;
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

      return result.affectedRows > 0 ? result : false;
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
      return result.affectedRows > 0 ? result : false;
    } catch (error) {
      console.log("error model Delete company :", error);
      return false;
    }
  },

  getAllUserWaitAccept: async (role_id, page) => {
    try {
      const numberPage = (page - 1) * 10;
      const result = await pool.query(
        `SELECT u.id,u.account, u.name, u.position,u.affiliated_department,u.status_id,us.status_name,u.created_at
      FROM
           users u left join account_status us on u.status_id=us.id
      WHERE (u.status_id = 1 or u.status_id = 3 or u.status_id = 2) and  u.role_id=${role_id} ORDER BY u.created_at desc LIMIT 10 OFFSET ${numberPage}`
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
      WHERE u.role_id=${role_id} and (u.status_id = 1 or u.status_id = 3 or u.status_id = 2)
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
          `SELECT u.id,u.account, u.name, u.position,u.affiliated_department,u.status_id,us.status_name,u.created_at
      FROM
           users u left join account_status us on u.status_id=us.id
      WHERE  (u.status_id = 1 or u.status_id = 3 or u.status_id = 2) and u.role_id=${role_id} ORDER BY u.created_at desc LIMIT 10 OFFSET ${numberPage}`
        );
        resultCount = await pool.query(
          `SELECT u.id,u.account, u.name, u.position,u.affiliated_department,u.status_id,us.status_name,u.created_at
      FROM
           users u left join account_status us on u.status_id=us.id
      WHERE (u.status_id = 1 or u.status_id = 3 or u.status_id = 2) and u.role_id=${role_id} ORDER BY u.created_at desc `
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
          "승인".includes(text) ? (text = "정상") : "";
          nameCondition = "us.status_name";
        } else if (option == 6) {
          nameCondition = "u.account";
        } else {
          nameCondition = "u.account";
        }

        resutlSearch = await pool.query(
          `SELECT u.id, u.name,u.account, u.position,u.affiliated_department,u.status_id,us.status_name,u.created_at
          FROM users u left join account_status us on u.status_id=us.id
      WHERE  (u.status_id = 1 or u.status_id = 3 or u.status_id = 2) and u.role_id=${role_id} and ${nameCondition} like "%${text}%" ORDER BY u.created_at desc LIMIT 10 OFFSET ${numberPage}`
        );
        resultCount = await pool.query(
          `SELECT u.id, u.name, u.position,u.affiliated_department,u.status_id,us.status_name,u.created_at
          FROM users u left join account_status us on u.status_id=us.id
      WHERE  (u.status_id = 1 or u.status_id = 3 or u.status_id = 2) and u.role_id=${role_id} and ${nameCondition} like "%${text}%"`
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

      return result.affectedRows > 0 ? result : false;
    } catch (error) {
      console.log("error model UpdateUserStatus:", error);
      return false;
    }
  },

  addNameLabel: async (data) => {
    try {
      const result = await pool.query(
        "insert into list_label (label_name,maintenance_id) values (?,?)",
        [data.label_name, data.maintenance_id]
      );
      // console.log(result)
      if (result) {
        return result;
      }
      //    console.log("resssssssssssssssssss",result);
    } catch (error) {
      console.log("error model name label register:", error);
      return false;
    }
  },

  getListLabel: async (maintenance_id) => {
    try {
      const result = await pool.query(
        `SELECT DISTINCT lb.id as id, lb.label_name as label_name
      FROM
           list_label lb
      where lb.maintenance_id="${maintenance_id}" and lb.id not in (select list_label_id from maintenance_class where maintenance_id="${maintenance_id}")
        ORDER BY created_at desc`
      );
      //   console.log(result);
      return result;
    } catch (error) {
      console.log("error model get list label :", error);
      return false;
    }
  },
  listLabelBySearchText: async (maintenance_id, text) => {
    try {
      let resutlSearch;

      if (!text) {
        resutlSearch = await pool.query(
          `SELECT DISTINCT lb.id as id, lb.label_name as label_name
      FROM
           list_label lb
          where lb.maintenance_id="${maintenance_id}" and lb.id not in (select list_label_id from maintenance_class where maintenance_id="${maintenance_id}")
        ORDER BY created_at desc`
        );
      }

      // search
      else if (text) {
        resutlSearch = await pool.query(
          `SELECT  DISTINCT lb.id as id, lb.label_name as label_name
      FROM
          list_label lb
      WHERE lb.label_name like "%${text}%" and lb.maintenance_id="${maintenance_id}" and lb.id not in (select list_label_id from maintenance_class where maintenance_id="${maintenance_id}")  ORDER BY created_at asc `
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
          : { status: true, message: "location is valid" };
      return result;
    } catch (error) {
      console.log("error model checked checkExistLabelId By Admin :", error);
      return false;
    }
  },
  addLabelToMainClass: async (maintenance_class_id, label_id) => {
    try {
      const result = await pool.query(
        "update maintenance_class set list_label_id=? where id=?",
        [label_id, maintenance_class_id]
      );
      // console.log(result)
      if (result) {
        return result;
      }
      //    console.log("resssssssssssssssssss",result);
    } catch (error) {
      console.log("error model Update label in mainClass:", error);
      return false;
    }
  },

  amountAccumulationRegister: async (nameCondition, datetime) => {
    try {
      let result = await pool.query(
        `SELECT mt.type_name, COUNT(rs.id) AS countRequest FROM maintenance_type mt left join request_storage rs on rs.maintenance_id = mt.id  and  ${nameCondition}(rs.created_at)="${datetime}" GROUP BY mt.type_name;`
      );
      result = result.map((item) => {
        return { ...item, countRequest: parseInt(item.countRequest) };
      });
      return result;
    } catch (error) {
      console.log("error model get amountAccumulationRegister :", error);
      return false;
    }
  },

  amountRequestCompleted: async (nameCondition, datetime) => {
    try {
      let result = await pool.query(
        `SELECT mt.type_name,COUNT(rs.id) AS countRequest FROM  maintenance_type mt left join request_storage rs on  rs.maintenance_id = mt.id  
        and (rs.status_id=4 OR rs.status_id=5) AND ${nameCondition}(rs.created_at)="${datetime}" GROUP BY mt.type_name;`
      );
      result = result.map((item) => {
        return { ...item, countRequest: parseInt(item.countRequest) };
      });
      return result;
    } catch (error) {
      console.log("error model get  amountRequestCompleted :", error);
      return false;
    }
  },
  amountRequestProcessing: async (nameCondition, datetime) => {
    try {
      let result = await pool.query(
        `SELECT mt.type_name,COUNT(rs.id) AS countRequest FROM maintenance_type mt left join request_storage rs on rs.maintenance_id = mt.id   and  (rs.status_id=2 OR rs.status_id=3) AND ${nameCondition}(rs.created_at)="${datetime}" GROUP BY mt.type_name;`
      );
      result = result.map((item) => {
        return { ...item, countRequest: parseInt(item.countRequest) };
      });
      return result;
    } catch (error) {
      console.log("error model get  amountRequestProcessing :", error);
      return false;
    }
  },
  amountPerRequestCompleted: async (nameCondition, datetime) => {
    try {
      const main_type = await helperModel.getMaintenanceType();
      const main_type_length = main_type.length;

      // console.log(main_type)
      let result = [];
      for (let i = 0; i < main_type_length; i++) {
        const item = main_type[i];
        let resultTemp = await pool.query(
          ` SELECT "${item.type_name}" AS type_name, CASE
          WHEN rs2.countRequest=0 THEN 0
          ELSE  ROUND(((rs.countRequest/rs2.countRequest)*100),2)
          END AS  countRequest
          FROM   
           (SELECT COUNT(rs.id) AS countRequest FROM request_storage rs WHERE rs.maintenance_id=${item.id} AND (rs.status_id=4 OR rs.status_id=5) AND ${nameCondition}(rs.created_at)="${datetime}") AS rs
			 ,
          (SELECT COUNT(rs.id) AS countRequest FROM request_storage rs WHERE rs.maintenance_id=${item.id} and ${nameCondition}(rs.created_at)="${datetime}") AS rs2;`
        );
        // console.log(item.id);
        // console.log(resultTemp)
        result.push(resultTemp[0]);
      }

      return result;
    } catch (error) {
      console.log("error model get  amountPerRequestCompleted :", error);
      return false;
    }
  },
  amountPerAllRequestCompleted: async (nameCondition, dateime) => {
    try {
      // console.log(nameCondition, dateime)
      let result = await pool.query(
        `SELECT CASE
          WHEN rs2.countRequest=0 THEN 0
          ELSE  ROUND(((COUNT(rs.id)/rs2.countRequest)*100),2)
          END AS  countRequest
          FROM   request_storage rs,
          (SELECT COUNT(rs.id) AS countRequest FROM request_storage rs  WHERE ${nameCondition}(rs.created_at)="${dateime}") AS rs2
           WHERE (rs.status_id=4 OR rs.status_id=5) AND ${nameCondition}(rs.created_at)="${dateime}";`
      );
      // console.log(result[0]);
      return result[0];
    } catch (error) {
      console.log("error model get  amountPerAllRequestCompleted :", error);
      return false;
    }
  },
  getInforChartCurrentMonth: async (maintenance_id, group_m) => {
    try {
      let result = await pool.query(
        `SELECT ll.id AS list_label_id, 
COALESCE(SUM(CASE WHEN MONTH(rs.created_at) = MONTH(CURRENT_DATE() - INTERVAL 1 MONTH) AND YEAR(rs.created_at) = YEAR(CURRENT_DATE() - INTERVAL 1 MONTH) THEN 1 ELSE 0 END), 0) AS count_last_month,
COALESCE(SUM(CASE WHEN MONTH(rs.created_at) = MONTH(CURRENT_DATE()) AND YEAR(rs.created_at) = YEAR(CURRENT_DATE()) THEN 1 ELSE 0 END), 0) AS count_this_month
FROM list_label ll 
LEFT JOIN maintenance_class mc ON mc.list_label_id = ll.id 
LEFT JOIN processing_details pd ON pd.label_id = ll.id 
LEFT JOIN request_storage rs ON pd.request_id = rs.id AND rs.status_id IN (4,5) 
where  mc.maintenance_id = ${maintenance_id} AND  mc.group_m = ${group_m}  
GROUP BY mc.id`
      );

      return result;
    } catch (error) {
      console.log("error model getInforChartCurrentMonth :", error);
      return false;
    }
  },
  // ham nay de lay bieu do theo thang
  getInforChartByOption: async (maintenance_id, group_m, option, data) => {
    try {
      const lastTime = data[option] - 1;
      const thisTime = data[option];
      // console.log(lastTime, thisTime);

      let result = await pool.query(
        `SELECT ll.id AS list_label_id, ll.label_name as name,
          COALESCE(SUM(CASE WHEN ${option}(rs.created_at) = ${lastTime} AND YEAR(rs.created_at) =${data.year} THEN 1 ELSE 0 END), 0) AS count_lastTime,
          COALESCE(SUM(CASE WHEN ${option}(rs.created_at) = ${thisTime} AND YEAR(rs.created_at) = ${data.year} THEN 1 ELSE 0 END), 0) AS count_thisTime 
          FROM list_label ll 
          LEFT JOIN maintenance_class mc ON mc.list_label_id = ll.id 
          LEFT JOIN processing_details pd ON pd.label_id = ll.id 
          LEFT JOIN request_storage rs ON pd.request_id = rs.id AND rs.status_id IN (4,5) 
          where  mc.group_m = ${group_m} AND mc.maintenance_id = ${maintenance_id} 
          GROUP BY mc.id`
      );

      return result;
    } catch (error) {
      console.log("error model getInforChartByOption :", error);
      return false;
    }
  },
  // ham nay lay bieu do theo ngay va tuan
  InforChartOneColumn: async (maintenance_id, group_m, option, data) => {
    try {
      const thisTime = data[option];
      // console.log(thisTime)
      let result = await pool.query(
        `SELECT ll.id AS list_label_id, ll.label_name as name,
          COALESCE(SUM(CASE WHEN ${option}(rs.created_at) = "${thisTime}" AND YEAR(rs.created_at) = "${data.year}" THEN 1 ELSE 0 END), 0) AS count_thisTime 
          FROM list_label ll 
          LEFT JOIN maintenance_class mc ON mc.list_label_id = ll.id 
          LEFT JOIN processing_details pd ON pd.label_id = ll.id 
          LEFT JOIN request_storage rs ON pd.request_id = rs.id AND rs.status_id IN (4,5) 
          where  mc.group_m = ${group_m} AND mc.maintenance_id = ${maintenance_id} 
          GROUP BY mc.id`
      );

      return result;
    } catch (error) {
      console.log("error model InforChartOneColumn :", error);
      return false;
    }
  },
  //
  getCountRequestNotCompleteOption: async (
    maintenance_id,
    month,
    week,
    year
  ) => {
    try {
      const lastTwoTime = month - 2;
      const lastTime = month - 1;
      const thisTime = week - 1;
      let result = await pool.query(
        `SELECT
        COALESCE(sum(CASE WHEN month(rs.created_at) = ${lastTwoTime} AND YEAR(rs.created_at) = ${year} THEN 1 ELSE 0 END), 0) AS count_last_two_month,
        COALESCE(sum(CASE WHEN month(rs.created_at) =${lastTime} AND YEAR(rs.created_at) = ${year} THEN 1 ELSE 0 END), 0) AS count_last_month,
        COALESCE(sum(CASE WHEN week(rs.created_at) = ${thisTime} AND YEAR(rs.created_at) = ${year} THEN 1 ELSE 0 END), 0) AS count_this_month
        FROM request_storage rs
        where  rs.status_id IN (1,2,3) and maintenance_id=${maintenance_id}`
        //         `SELECT
        //  COALESCE(sum(CASE WHEN MONTH(rs.created_at) = 3 AND YEAR(rs.created_at) = 2024 THEN 1 ELSE 0 END), 0) AS count_last_two_month,
        //  COALESCE(sum(CASE WHEN MONTH(rs.created_at) =4 AND YEAR(rs.created_at) = 2024 THEN 1 ELSE 0 END), 0) AS count_last_month,
        //  COALESCE(sum(CASE WHEN MONTH(rs.created_at) = 5 AND YEAR(rs.created_at) = 2024 THEN 1 ELSE 0 END), 0) AS count_this_month
        //  FROM request_storage rs
        //  where  rs.status_id IN (1,2,3) and maintenance_id=1`
      );
      // console.log(result[0]);
      return result[0];
    } catch (error) {
      console.log("error model getCountRequestNotCompleteCurrent :", error);
      return false;
    }
  },

  getCountAllMethod: async (option, datetime) => {
    try {
      let result = await pool.query(
        `select mt.id,mt.method_name, CAST(COUNT(rs.id) as CHAR) AS count 
        from method mt left join request_storage rs on rs.method_id=mt.id  and ${option}(rs.created_at)="${datetime}" group by mt.id`
      );

      return result;
    } catch (error) {
      console.log("error model getAllMethod :", error);
      return false;
    }
  },

  getCountAllSolution: async (option, datetime) => {
    try {
      let result = await pool.query(
        `select s.id,s.solution_name, s.type, cast(count(rs.id) as char) as count 
        from solution s left join request_storage rs on s.id=rs.solution_id  and ${option}(rs.created_at)="${datetime}"  group by s.id `
      );
      // console.log(result)
      return result;
    } catch (error) {
      console.log("error model getAllSolution :", error);
      return false;
    }
  },
  getListNewRequest: async () => {
    try {
      let result = await pool.query(
        `select rs.id as request_id, rs.title_request,rs.content_request,u.name,rs.created_at from request_storage rs left join users u on rs.petitioner_id = u.id order by rs.updated_at desc limit 5`
      );

      return result;
    } catch (error) {
      console.log("error model getListNewRequest :", error);
      return false;
    }
  },
  getAdminInfor: async (user_id) => {
    try {
      const result = await pool.query(
        `SELECT u.id,u.account, u.name, u.phone_number, u.tel_number, u.email, "Admin" as leveluser
      FROM
           users u
      WHERE  u.id=${user_id} `
      );
      // console.log(result)
      return result[0];
    } catch (error) {
      console.log("error model getAdminInfor :", error);
      return false;
    }
  },
  updateAdminInfor: async (user_id, data) => {
    try {
      let result;
      if (!data.password) {
        result = await pool.query(
          `update users set 
          email="${data.email}",
          tel_number="${data.tel_number}",
          name="${data.name}",
          phone_number="${data.phone_number}"
          where id="${user_id}";`
        );
      } else {
        const password_hash = bcrypt.hashSync(data.password);

        result = await pool.query(
          `update users set
          email="${data.email}",    
          password="${password_hash}",
          tel_number="${data.tel_number}",
          name="${data.name}",
          phone_number="${data.phone_number}"
          where id="${user_id}";`
        );
      }
      return result.affectedRows > 0 ? result : false;
    } catch (error) {
      console.log("error model UpdateUserStatus:", error);
      return false;
    }
  },
  getNewHelper: async (user_id) => {
    try {
      const result = await pool.query(
        `SELECT u.id,u.account, u.name, c.name_company, "헬프데스크 담당자" as main_type,u.status_id,us.status_name as status_name,u.created_at
      FROM
           users u
           left join account_status us on u.status_id=us.id
           left join roles r on r.id = u.role_id
           left join company c on u.company_id=c.id
      WHERE    u.id=${user_id} `
      );
      // console.log(result)
      return result[0];
    } catch (error) {
      console.log("error model getNewHelper :", error);
      return false;
    }
  },

  //

  resetAccount: async (user_id) => {
    try {
      const result = await pool.query(
        `update users set 
          count_login = 0,
          last_login = now()
          where id="${user_id}"; `
      );
      // console.log(result)
      return result.affectedRows > 0 ? result : false;
    } catch (error) {
      console.log("error model getNewHelper :", error);
      return false;
    }
  },
  //
  getNewUser: async (user_id) => {
    try {
      const result = await pool.query(
        `SELECT u.id,u.account, u.name, u.position,u.affiliated_department,u.status_id,us.status_name,u.created_at,tel_number,phone_number,email, "일반사용자" as leveluser
      FROM
           users u left join  account_status us on us.id=u.status_id left join roles r on r.id=u.role_id
      WHERE u.status_id=us.id and  u.id=${user_id} `
      );

      return result[0];
    } catch (error) {
      console.log("error model getNewUser :", error);
      return false;
    }
  },

  getNewCompany: async (company_id) => {
    try {
      const result = await pool.query(
        `SELECT c.id,c.name_company,c.business_code, COUNT(u.id) as amountHelper,c.created_at,u2.name as creator
         FROM company c
         left JOIN users u ON c.id=u.company_id
         left JOIN users u2 ON c.creator_id=u2.id
         where c.id=${company_id}`
      );

      return result[0];
    } catch (error) {
      console.log("error model getNewCompany :", error);
      return false;
    }
  },
  getNewMainClass: async (id) => {
    try {
      const result = await pool.query(
        `SELECT *
         FROM maintenance_class
         where id=${id}`
      );

      return result[0];
    } catch (error) {
      console.log("error model getClassLabel :", error);
      return false;
    }
  },

  helpdeskToOrther: async (page) => {
    try {
      const numberPage = page * 10;
      const result = await pool.query(
        `SELECT u.id,u.account, u.name, c.name_company,"헬프데스크 담당자" as main_type,u.status_id,us.status_name,u.created_at
      FROM
           users u
            left join account_status us on u.status_id=us.id
            left join roles r on u.role_id= r.id
            left join company c on u.company_id= c.id

      WHERE   u.status_id=2 and  (u.role_id=1 or u.role_id=2 or u.role_id=5) ORDER BY u.created_at desc LIMIT 1 OFFSET ${numberPage}`
      );
      // console.log(result);
      return result[0];
    } catch (error) {
      console.log("error model requestToOrther:", error);
      return false;
    }
  },
  userToOrther: async (page) => {
    try {
      const numberPage = page * 10;
      const result = await pool.query(
        `SELECT u.id,u.account, u.name, u.position,u.affiliated_department,u.status_id,us.status_name,u.created_at,u.tel_number,u.phone_number,u.email,"일반사용자" as leveluser
      FROM
           users u left join  account_status us on u.status_id=us.id left join roles r on r.id=u.role_id
      WHERE  (u.status_id != 1 and u.status_id != 3) and  u.role_id=4   ORDER BY u.created_at desc LIMIT 1 OFFSET ${numberPage}`
      );
      //   console.log(result);
      return result[0];
    } catch (error) {
      console.log("error model requestToOrther:", error);
      return false;
    }
  },
  companyToOrther: async (page) => {
    try {
      const numberPage = page * 10;
      // console.log(numberPage)
      const result = await pool.query(
        `SELECT c.id,c.name_company,c.business_code, COUNT(u.id) as amountHelper,c.created_at
         FROM company c
         left JOIN users u ON c.id=u.company_id
        GROUP BY c.id ORDER BY  c.created_at DESC   LIMIT 1 OFFSET ${numberPage}`
      );
      // console.log(result);
      return result[0];
    } catch (error) {
      console.log("error model companyToOrther:", error);
      return false;
    }
  },

  deleteLabel: async (label_id) => {
    try {
      result = await pool.query(
        `DELETE FROM list_label WHERE id= "${label_id}"`
      );
      return result.affectedRows > 0 ? result : false;
    } catch (error) {
      console.log("error model delete label :", error);
      return false;
    }
  },
  deleteLabelProcess: async (label_id) => {
    try {
      result = await pool.query(
        `DELETE FROM processing_details WHERE label_id= "${label_id}"`
      );
      return result.affectedRows > 0 ? result : false;
    } catch (error) {
      console.log("error model deleteLabelProcess :", error);
      return false;
    }
  },
};
