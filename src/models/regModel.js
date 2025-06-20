const db = require("../config/db");

// Get schedule details
const getScheduleById = async (cid, schid) => {
  const [rows] = await db.execute(
    "SELECT * FROM schedule WHERE cid = ? AND schid = ?",
    [cid, schid]
  );
  return rows;
};

// Get questions for a given course via coursequestionjoin
const getQuestionsByCourseId = async (cid) => {
    console.log("course id is "+cid);
  const [rows] = await db.execute(`
    SELECT q.*
    FROM question q
    JOIN coursequestionjoin cq ON q.qid = cq.qid
    WHERE cq.cid = ?
  `, [cid]);
  return rows;
};

module.exports = {
  getScheduleById,
  getQuestionsByCourseId
};
