const db = require("../config/db");
const service = require("../services/service");
const regmodel = require("../models/regModel");
exports.dashboard = (req, res) => {
  res.render('studentDashboard');
};
// nav.ejs
exports.navbar=(req,res)=>{
  res.render("nav.ejs");
}

//view student
exports.viewStudent = (req, res) => {
    if (!req.session.student) {
        return res.redirect("/studentlogin"); // or wherever you want to send if not authenticated
    }
    // Retrieve student details from the database based on the email or name in the session
    const sname = req.session.student;
    const query = "SELECT * FROM student WHERE sname = ?";
    db.query(query, [sname], (err, results) => {
        if (err) {
            console.error("Error retrieving student details:", err);
            return res.status(500).send("Server Error.");
        }
        if (results.length > 0) {
            res.render("viewstudent.ejs", { student: results[0],msg:'' });
        } else {
            res.status(404).send("Student not found.");
        }
    });
};
   
 exports.studentRegister = async (req, res) => {
    try {
        const schedules = await service.getExamSchedules();
        res.render('register', { schedules, msg: '' });
    } catch (err) {
        console.error(err);
         res.status(500).send("Error loading form.");
     }
};

/*exports.saveStudent = async (req, res) => {
  const data = req.body;
  try {
    await service.saveStudent(data);
    // After saving, fetch schedules again to show form with a success message
    const schedules = await service.getExamSchedules();
    res.render('register', { schedules, msg: 'Student Registered Successfully!' });
    res.redirect(`/student/${result.insertId}`);

  } catch (err) {
    console.error(err);
    // On error, you may want to show an error message instead
    const schedules = await service.getExamSchedules();
    res.render('register', { schedules, msg: 'Error saving student. Please try again!' });
  }
};  */

// exports.saveStudent = async (req, res) => {
//   const data = req.body;
//   try {
//     const result = await service.saveStudent(data);
//     res.redirect(`/student/${result.insertId}`); // redirect to detail page
//   } catch (err) {
//     console.error(err);
//     const schedules = await service.getExamSchedules();
//     res.render('register', { schedules, msg: 'Error saving student. Please try again!' });
//   }
// };


exports.getRegisterPage = (req, res) => {
    res.render('register', { msg: '' });
};
// This one is for full registration (insert into student table)
exports.registerStudentFull = (req, res) => {
    const { sname, semail, spassword, scontact } = req.body;

    if (!sname || !semail || !spassword || !scontact) {
        return res.render('register', { msg: 'All fields are required.' });
    }

    const sql = "INSERT INTO student (sname, semail, spassword, scontact) VALUES (?, ?, ?, ?)";
    db.query(sql, [sname, semail, spassword, scontact], (err, result) => {
        if (err) {
            console.error('DB full error:', err);
            return res.render('register', { msg: 'Error registering student.' });
        }
         res.redirect("/loginregister");
    });
};


// Utility function to reload schedules and render page
function loadSchedulesAndRender(res, msg, student) {
  const sql = `
      SELECT s.schid, c.cname, e.exname, s.date, s.starttime, s.endtime
      FROM schedule s
      JOIN course c ON s.cid = c.cid
      JOIN exam e ON s.ex_id = e.ex_id
  ;`

  db.query(sql, (err, schedules) => {
    if (err) {
      console.error("DB error:", err);
      return res.render("loginregister", {
        schedules: [],
        msg: "Database error",
        student
      });
    }

    res.render("loginregister", {
      schedules,
      msg,
      student
    });
  });
}

// GET: Show registration form with auto-filled student data
exports.showRegister = (req, res) => {
  const student = req.session.student;
  if (!student) return res.redirect("/studentlogin");

  loadSchedulesAndRender(res, "", student);
};

// POST: Register student for exam
exports.registerStudent = (req, res) => {
  const { schid } = req.body;
  const student = req.session.student;

  if (!student || !student.sname || !student.semail) {
    return res.redirect("/studentlogin");
  }

  if (!schid) {
    return loadSchedulesAndRender(res, "Please select a schedule.", student);
  }

  const sql = "INSERT INTO student (sname, semail, schid) VALUES (?, ?, ?)";
  db.query(sql, [student.sname, student.semail, schid], (err, result) => {
    if (err) {
      console.error("Registration Error:", err);
      if (err.code === 'ER_DUP_ENTRY') {
        return loadSchedulesAndRender(res, "Already registered for this schedule.", student);
      }
      return loadSchedulesAndRender(res, "Error during registration.", student);
    }

    loadSchedulesAndRender(res, "Registration successful!", student);
  });
};



exports.getStudentById = async (req, res) => {

  try {
    const student = await service.getStudentById(req.params.id);
    if (!student) return res.status(404).send("Student not found");
    res.render("registerview", { student,msg:'' });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving student details");
  }
};



//student login
exports.studentlog=(req,res)=>{

    res.render("studentlogin.ejs",{msg: "" });
};

exports.studentlogin = (req, res) => {
  const { sname, spassword } = req.body;

  const query = "SELECT * FROM student WHERE sname = ? AND spassword = ?";
  db.query(query, [sname, spassword], (err, results) => {
    if (err) {
      console.error("Login Error:", err);
      return res.render("studentlogin.ejs", { msg: "Server error" }); 
    }

    if (results.length > 0) {
      // Save full student data in session
      req.session.student = {
        sname: results[0].sname,
        semail: results[0].semail,
        spassword:results[0].spassword,
        scontact:results[0].scontact,
        sid: results[0].sid // optionally store id too
      };
      return res.redirect("/loginregister");
    } else {
      return res.render("studentlogin.ejs", { msg: "Invalid username or password" });
    }
  });
};


  exports.studenthome = (req, res) => {
  if (!req.session.student) {
    return res.redirect("/studenthome");
  }
  res.render("studentdashboard.ejs", {   });
};

  
exports.adminlog=(req,res)=>{
    res.render("adminlogin.ejs",{msg: "" });
};
  //admin login
exports.adminlogin = (req, res) => {
  const { admin_name, admin_pass } = req.body;

  const query = "SELECT * FROM admin WHERE aname = ? AND apassword = ?";
  db.query(query, [admin_name, admin_pass], (err, results) => {
    if (err) {
      console.error("Login Error:", err);
      return res.render("adminlogin.ejs", { msg: "Server error" }); 
    }

    if (results.length > 0) {
      req.session.admin = results[0].aname;
      return res.redirect("/adminhome"); 
    } else {
      return res.render("adminlogin.ejs", { msg: "Invalid username or password" });
    }
  });
};


exports.adminhome = (req, res) => {
  if (!req.session.admin) {
    return res.redirect("/adminhome");
  }
  res.render("dashboard.ejs", { admin: req.session.admin });
};

//addcourse
exports.addcourse=(req,res)=>{
    res.render("subject.ejs");
}

exports.addcourse=(req,res)=>{
    const query= "SELECT * from course";
    db.query(query,(err,results)=>{
        if(err)
        {
            console.error("Error Fetching subjects:",err);
            return res.status(500).send("Error fetching subjects");
        }
        res.render("subject.ejs", {subjects:results});
    });
};

exports.insertcourse=(req,res)=>{
    const {cname}=req.body;
    const query="insert into course (cname) values (?)";
    db.query(query,[cname],(err,result)=>{
        if(err)
        {
            console.error("Error Fetching subjects:",err);
            return res.status(500).send("Error fetching subjects");
        }
        res.redirect("/subject");
    });
};

exports.deletesubject=(req,res)=>{
    const{cid}=req.params;
    const query="delete from course where cid=?";
    db.query(query,[cid],(err,result)=>{
        if(err){
            console.error("Error deleting subjects:",err);
            return res.status(500).send("Failed to delete subject");
        }
        res.redirect("/subject");
    });
};

exports.admin=(req,res)=>{
    const query = "SELECT * FROM admin";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching admin data:", err);
            return res.status(500).send("Server error");
        }
        res.render("admin.ejs", { admin: results }); 
    });
};

exports.adminlogout=(req,res)=>{
    req.session.destroy(err=>{
        if(err) return res.send("logout error");
        res.redirect("/adminlogin");
    });
};


exports.viewRegistrationDetails = (req, res) => {
  // const { schid } = req.body;
  const student = req.session.student;
  console.log("student is "+student.semail)
   const sql = 
   `select s.sname,
s.semail,
c.cname,
c.cid,
e.exname,
e.ex_id,
sch.schid,
sch.date,

sch.starttime,
sch.endtime,
e.totalmark,
e.passingmark
FROM student s
JOIN schedule sch ON s.schid = sch.schid
JOIN course c ON sch.cid = c.cid
JOIN exam e ON sch.ex_id = e.ex_id
WHERE s.semail = ?`
  

  db.query(sql, [student.semail], (err, results) => {
    if (err) {
      console.error("View Registration Error:", err);
      return res.render("registerview", { student: null, error: "Database error occurred." });
    }

    if (results.length === 0) {
      return res.render("registerview", { student: null, error: "No exam registration found." });
    }

    console.log(results)
    // res.render("registerview", { student: results[0], error: null });
        // res.render("registerview", { student:req.session.student, error: null });
         res.render("registerview", {
      student,      // from session
      exams: results, 
      // from query
      error: null
    });

   });
};

// exports.exam=(req,res)=>{
//   res.render("start.ejs");
// }



exports.start = (req, res) => {
  const cid = req.query.cid;
  const schid = req.query.schid;

  console.log("Course ID:", cid, "Schedule ID:", schid);

  // Fetch schedule
  db.query(
    "SELECT * FROM schedule WHERE cid = ? AND schid = ?",
    [cid, schid],
    (err, scheduleRows) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).send("Server Error");
      }

      if (!scheduleRows || scheduleRows.length === 0) {
        return res.send("Invalid course or schedule ID");
      }

      const schedule = scheduleRows[0];

      // Fetch questions
      db.query(
        `SELECT q.*
         FROM question q
         JOIN coursequestionjoin cq ON q.qid = cq.qid
         WHERE cq.cid = ?`,
        [cid],
        (err, questionRows) => {
          if (err) {
            console.error("DB error:", err);
            return res.status(500).send("Server Error");
          }

          if (!questionRows || questionRows.length === 0) {
            return res.send("No questions found for this course");
          }

          // Store in session
          req.session.cid = schedule.cid;
          req.session.schid = schedule.schid;

          // Render
          res.render("start", {
            questions: questionRows,
            schedule
          });
        }
      );
    }
  );
};

// 
exports.submitExam = async (req, res) => {
  const submittedAnswers = req.body;
  const student = req.session.student;

  if (!student) {
    return res.status(401).send("Session expired. Please log in again.");
  }

  const semail = student.semail;
  const spassword = student.spassword;

  // Optional: You can skip this DB check if session is already trusted.
  db.query('SELECT * FROM student WHERE semail = ? AND spassword = ?', [semail, spassword], (err, result) => {
    if (err) return res.status(500).send("Database error during student validation");

    if (result.length === 0) {
      return res.send('Invalid credentials');
    }

    // Now fetch questions and calculate result
    const sql = `SELECT qid, qname, answer, op1, op2, op3, op4 FROM question`;

    db.query(sql, (err, questions) => {
      if (err) {
        console.error("SQL Error:", err);
        return res.status(500).send("Error fetching questions");
      }

      const results = questions.map(q => {
        const selected = submittedAnswers[`answer${q.qid}`];
        const options = [q.op1, q.op2, q.op3, q.op4];
        const correctText = options[q.answer - 1];

        return {
          question: q.qname,
          selectedAnswer: selected,
          correctAnswer: correctText,
          isCorrect: selected === correctText
        };
      });

      const total = results.length;
      const correct = results.filter(r => r.isCorrect).length;
      const incorrect = total - correct;

      // ✅ Final and ONLY response
      return res.render("resultpage", {
        student: result[0],  // or use `student` from session
        results,
        total,
        correct,
        incorrect,
        timeTaken: "30 minutes"
      });
    });
  });

};

// Route: POST /startexam
exports.startExam = (req, res) => {
  const { schid } = req.body; // Schedule ID passed from previous page or session

  const scheduleQuery = `
    SELECT *, TIMESTAMPDIFF(MINUTE, starttime, endtime) AS duration 
    FROM schedule 
    WHERE schid = ?
  `;

  db.query(scheduleQuery, [schid], (err, scheduleResult) => {
    if (err || scheduleResult.length === 0) {
      return res.status(500).send("Schedule not found or DB error");
    }

    const schedule = scheduleResult[0];
     const duration = schedule.duration; 
    

    // Optional: Block if exam not yet started or already ended
    const now = new Date();
    const examStart = new Date(`${schedule.date}T${schedule.starttime}`);
    const examEnd = new Date(`${schedule.date}T${schedule.endtime}`);

    if (now < examStart) {
      return res.send("Exam has not started yet.");
    }

    if (now > examEnd) {
      return res.send("Exam time is over.");
    }

    db.query("SELECT * FROM question WHERE cid = ?", [schedule.cid], (err, questions) => {
      if (err) return res.status(500).send("Error fetching questions");

      res.render("exam", {
        questions,
        schedule,
        duration,
      });
    });
  });
};

// Route: POST /startexam
exports.startExam = (req, res) => {
  const { schid } = req.body;

  const scheduleQuery = `
    SELECT *, 
      TIMESTAMPDIFF(MINUTE, 
        CONCAT(date, ' ', starttime), 
        CONCAT(date, ' ', endtime)
      ) AS duration
    FROM schedule 
    WHERE schid = ?
  `;

  db.query(scheduleQuery, [schid], (err, scheduleResult) => {
    if (err || scheduleResult.length === 0) {
      return res.status(500).send("Schedule not found or DB error");
    }

    const schedule = scheduleResult[0];
    const duration = schedule.duration;

    const now = new Date();
    const examStart = new Date(`${schedule.date}T${schedule.starttime}`);
    const examEnd = new Date(`${schedule.date}T${schedule.endtime}`);

    if (now < examStart) {
      return res.send("⏳ Exam has not started yet.");
    }

    if (now > examEnd) {
      return res.send("⛔ Exam time is over.");
    }

    db.query("SELECT * FROM question WHERE cid = ?", [schedule.cid], (err, questions) => {
      if (err) return res.status(500).send("Error fetching questions");

      res.render("exam", {
        questions,
        schedule,
        duration,
      });
    });
  });
};







