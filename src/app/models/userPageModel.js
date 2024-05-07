const { pool } = require("../../config/db");

module.exports = {
  getRequestList: async (data) => {
    try {
      const result = await pool.query(
        `SELECT rs.id,rs.title_request,mt.type_name,rstt.status_name,users.name AS pertitioner,users2.name AS recipient_id,rs.created_at,rd.completion_date
        FROM maintenance_type mt, request_storage rs,request_details rd,request_status rstt, users,(SELECT * FROM users) AS users2
        WHERE rs.maintenance_id=mt.id and rs.id=rd.request_id and rstt.id=rd.status_id AND users.id=rs.petitioner_id AND users2.id=rs.recipient_id`
      );

      return { message: "Get Successfully", data: result, status: true };
    } catch (error) {
      console.log("error model register:", error);
      return { message: "Get fail", data: "", status: false };
    }
  },
};
