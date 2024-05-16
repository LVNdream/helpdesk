const { pool } = require("../../config/db");

module.exports = {
  getRequestListByHelper: async (role_id) => {
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
    rs.maintenance_id = ${role_id};`
      );

      return result;
    } catch (error) {
      console.log("error model getRequestListByHelper :", error);
      return false;
    }
  },
};
