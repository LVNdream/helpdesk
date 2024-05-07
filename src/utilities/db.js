// const mariadb = require("mariadb");
// const config = require("../config/db.json");
const { pool } = require("../config/db");

module.exports = {
  register: async function register(data) {
    // Insert Data
    return new Promise((resolve, reject) => {
      pool.query(
        "insert into users (id,name,password,email,tel_number,phone_number,position,affiliated_department,status_id,role_id)",
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
        ],
        function (error, results, fields) {
          if (error) {
           return  reject(error);
          }
          return resolve(results);
        }
      );
    });

  },
};
