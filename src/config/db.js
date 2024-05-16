const mariadb = require("mariadb");
module.exports = {
  pool: mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    connectionLimit: 10,
  }),
};

