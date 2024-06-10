const { pool } = require("../../config/db");

module.exports = {
  register: async (data) => {
    try {
      const result = await pool.query(
        "insert into users (account,name,password,email,tel_number,phone_number,position,affiliated_department,status_id,role_id) values (?,?,?,?,?,?,?,?,?,?)",
        [
          data.id,
          data.name,
          data.password,
          data.email,
          data.tel_number,
          data.phone_number,
          data.position,
          data.affiliated_department,
          data.status_id,
          data.role_id,
        ]
      );
      // console.log(result)
      if (result) {
        return { message: "Registered Successfully", status: true };
      }
      //    console.log("resssssssssssssssssss",result);
    } catch (error) {
      console.log("error model register:", error);
      return false;
    }
  },

  checkExistId: async (id) => {
    try {
      const result = await pool.query(
        `select * from users where account="${id}" `
      );
      if (result[0]) {
        return { message: "ID have existed", status: false };
      } else {
        return { message: "ID valid", status: true };
      }
    } catch (error) {
      console.log("error model find ID:", error);
      return false;
    }
  },

  findAccountById: async (id) => {
    try {
      const result = await pool.query(
        `select * from users where account="${id}" `
      );
      return result[0] ? result[0] : {};
    } catch (error) {
      console.log("error model find ID:", error);
      return false;
    }
  },
  findAccountCheckPass: async (id) => {
    try {
      const result = await pool.query(`select * from users where id="${id}" `);
      return result[0] ? result[0] : {};
    } catch (error) {
      console.log("error model find ID:", error);
      return false;
    }
  },

  findId: async (data) => {
    try {
      const result = await pool.query(
        `select account from users where 
        phone_number="${data.phone_number}" and
        name="${data.name}" and
        position="${data.position}" and  
        email="${data.email}"`
      );
      if (result[0]) {
        return { data: result[0], status: true };
      } else {
        return { data: result[0], status: false };
      }
    } catch (error) {
      console.log("error model find ID:", error);
      return false;
    }
  },
  updateFirstLogin: async (user_id) => {
    try {
      const result = await pool.query(
        `update users set first_login=1 where id="${user_id}" `
      );
      return result.affectedRows > 0 ? result : false;
    } catch (error) {
      console.log("error model updateFirstlogin:", error);
      return false;
    }
  },
  updateCountLogin: async (user_id, count) => {
    try {
      const result = await pool.query(
        `update users set count_login=${count} where id="${user_id}" `
      );
      return result.affectedRows > 0 ? result : false;
    } catch (error) {
      console.log("error model updateFirstlogin:", error);
      return false;
    }
  },
  updateLastTimeLogin: async (user_id, dateTime) => {
    try {
      const result = await pool.query(
        `update users set last_login=${dateTime} where id="${user_id}" `
      );
      return result.affectedRows > 0 ? result : false;
    } catch (error) {
      console.log("error model updateLastTimeLogin:", error);
      return false;
    }
  },
  getUserName: async (id) => {
    try {
      const result = await pool.query(
        `select name,role_id from users where id="${id}" `
      );
      return result[0] ? result[0] : {};
    } catch (error) {
      console.log("error model getUserName", error);
      return false;
    }
  },
};
