
const conn = require("../config/db");
const regmodel = require("../models/regModel");

//exports.getExamSchedules = () => {
 // return new Promise((resolve, reject) => {
   // const q = `SELECT schid, cname, exname, date, starttime, endtime 
              // FROM schedule 
             //  JOIN course USING(cid) 
             //  JOIN exam ON schedule.ex_id = exam.ex_id`;
   // conn.query(q, (err, result) => {
      //if (err) reject(err);
     // else resolve(result);
  //  });
  //});
//};

/*exports.saveStudent = (data) => {
  const { sname, semail, spassword, scontact, schid } = data;
  return new Promise((resolve, reject) => {
    const q = `INSERT INTO student (sname, semail, spassword, scontact, schid) VALUES (?, ?, ?, ?, ?)`;
    conn.query(q, [sname, semail, spassword, scontact, schid], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};*/

// exports.getStudentById = (id) => {
//   return new Promise((resolve, reject) => {
//     const q = `
//       SELECT s.sid, s.sname, c.cname, e.exname, sc.date, sc.starttime, sc.endtime,
//              e.totalmark, e.passingmark
//       FROM student s    
//       JOIN schedule sc ON s.schid = sc.schid    
//       JOIN course c ON sc.cid = c.cid    
//       JOIN exam e ON sc.ex_id = e.ex_id   
//       WHERE s.sid = ?`;
      
//     conn.query(q, [id], (err, result) => {
//       if (err) reject(err);
//       else resolve(result[0]);
//     });
//   });
// };
