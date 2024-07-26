const { pool } = require("../../config/db");
const bcrypt = require("bcryptjs");

module.exports = {
  // create new account for user in database
  register: async (data) => {
    try {
      const result = await pool.query(
        "insert into users (account,name,password,email,tel_number,phone_number,position,affiliated_department,status_id,role_id,first_login) values (?,?,?,?,?,?,?,?,?,?,?)",
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
          1,
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

  // check existence of account in database
  checkExistId: async (id) => {
    try {
      const result = await pool.query(
        `select * from users where BINARY account="${id}" and deleteduser=0`
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

  // find user account in table user
  findAccountById: async (id) => {
    try {
      const result = await pool.query(
        `select * from users where BINARY account="${id}" and deleteduser="0" `
      );
      return result[0] ? result[0] : {};
    } catch (error) {
      console.log("error model find ID:", error);
      return false;
    }
  },

  // find user infor in table user
  findInforById: async (id) => {
    try {
      const result = await pool.query(`select * from users where id="${id}" `);
      return result[0] ? result[0] : {};
    } catch (error) {
      console.log("error model find ID:", error);
      return false;
    }
  },

  // find user infor in table user to checkpass
  findAccountCheckPass: async (id) => {
    try {
      const result = await pool.query(`select * from users where id="${id}" `);
      return result[0] ? result[0] : {};
    } catch (error) {
      console.log("error model find ID:", error);
      return false;
    }
  },

  // find user account when user forgot pass
  findId: async (data) => {
    try {
      const result = await pool.query(
        `select id,account from users where 
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

  // change first login status
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

  // increase the number of incorrect password entries
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

  // update the time of last login time
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

  // get user name
  getUserName: async (id) => {
    try {
      const result = await pool.query(
        `select account,name,role_id from users where id="${id}" `
      );
      return result[0] ? result[0] : {};
    } catch (error) {
      console.log("error model getUserName", error);
      return false;
    }
  },

  // change password
  updatePassword: async (user_id, password) => {
    try {
      let result;
      // console.log(user_id, password)
      const password_hash = bcrypt.hashSync(password, 8);

      result = await pool.query(
        `update users set
          password="${password_hash}"
          where id="${user_id}";`
      );

      return result.affectedRows > 0 ? result : false;
    } catch (error) {
      console.log("error model updatePassword:", error);
      return false;
    }
  },

  // update field require change password
  updateResetPass: async (user_id, reset_password) => {
    try {
      let result;
      result = await pool.query(
        `update users set
          reset_password="${reset_password}"
          where id="${user_id}";`
      );

      return result.affectedRows > 0 ? result : false;
    } catch (error) {
      console.log("error model updateResetPass:", error);
      return false;
    }
  },
};
