const { pool } = require("../../config/db");

module.exports = {
  register: async (data) => {
    try {
      const result = await pool.query(
        "insert into users (id,name,password,email,tel_number,phone_number,position,affiliated_department,status_id,role_id) values (?,?,?,?,?,?,?,?,?,?)",
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
      const result = await pool.query(`select * from users where id="${id}" `);
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
      const result = await pool.query(`select * from users where id=${id} `);

      return { data: result[0], status: true };
    } catch (error) {
      console.log("error model find ID:", error);
      return { message: "Error model find account by ID", status: false };
    }
  },

  findId: async (data) => {
    try {
      const result = await pool.query(
        `select id,name, email from users where 
        phone_number="${data.phone_number}" and
        name="${data.name}" and
        position="${data.position}" and  
        email="${data.email}"`
      );
      if (result[0]) {
        return { data: result[0], status: true };
      }
      else {
        return { data: result[0], status: true };
      }
    } catch (error) {
      console.log("error model find ID:", error);
      return { message: "Error model find ID", status: false };
    }
  },
};
