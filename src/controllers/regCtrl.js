const db = require("../config/db");
exports.dashboard = (req, res) => {
  res.render('studentDashboard');
};

exports.navbar=(req,res)=>{
  res.render("nav.ejs");
}

exports.studentRegister = (req, res) => {
  const { name, email, contact, password } = req.body;
  const query = "INSERT INTO student (sname, semail, scontact, spassword) VALUES (?, ?, ?, ?)";
  
  db.query(query, [name, email, contact, password], (err, results) => {
    if (err) {
      console.error("Registration Error :", err);
      return res.render("register.ejs", {msg: "Server Error"});
    }
    res.render("register.ejs", {msg: "Registration Successful!"}); 
  });
};

exports.studentlog=(req,res)=>{

    res.render("studentlogin.ejs",{msg: "" });
};

exports.studentlogin = (req, res) => {
  const { sname, spassword} = req.body;

  const query = "SELECT * FROM student WHERE sname = ? AND spassword = ?";
  db.query(query, [ sname, spassword], (err, results) => {
    if (err) {
      console.error("Login Error:", err);
      return res.render("studentlogin.ejs", { msg: "Server error" }); 
    }

    if (results.length > 0) {
      req.session.student = results[0].sname;
      return res.redirect("/studenthome"); 
    } else {
      return res.render("studentlogin.ejs", { msg: "Invalid username or password" });
    }
    });
}

exports.adminlog=(req,res)=>{
    res.render("adminlogin.ejs",{msg: "" });
};

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
    return res.redirect("/adminlogin");
  }
  res.render("dashboard.ejs", { admin: req.session.admin });
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

exports.addexam=(req,res)=>{
    const query="select * from exam";
    db.query(query,(err,results)=>{
        if(err)
        {
            console.error("Error Fetching exams:",err);
            return res.status(500).send("Error fetching exams");
        }
        res.render("exam.ejs", {exams:results});
    });
};

exports.insertexam=(req,res)=>{
    const {exname,totalmark,passingmark}=req.body;
    const query="insert into exam (exname,totalmark,passingmark) values (?,?,?)";
    db.query(query,[exname,totalmark,passingmark],(err,result)=>{
        if(err)
        {
            console.error("Error fetching exams:",err);
            return res.status(500).send("Error fetching exams");
        }
        res.redirect("/exam");
    });
};

exports.deletexam=(req,res)=>{
    const {ex_id}=req.params;
    const query="delete from exam where ex_id=?";
    db.query(query,[ex_id],(err,result)=>{
        if(err){
            console.error("Error deleting exams:",err);
            return res.status(500).send("Failed to delete exam");
        }
        res.redirect("/exam");
    });
};

exports.getUpdateExamForm = (req, res) => {
    const { ex_id } = req.params;
    const query = "SELECT * FROM exam WHERE ex_id = ?";
    db.query(query, [ex_id], (err, results) => {
        if (err) {
            console.error("Error fetching exam:", err);
            return res.status(500).send("Failed to fetch exam data");
        }
        res.render("updatexam.ejs", { exam: results[0] }); 
    });
};

exports.updateExam=(req,res)=>{
    const {ex_id}=req.params;
    const {exname,totalmark,passingmark}=req.body;
    const query="update exam set exname=? , totalmark=? , passingmark=? where ex_id=?";
    db.query(query,[exname,totalmark,passingmark,ex_id],(err,result)=>{
        if(err){
        console.error("Error Fetching exams",err);
        return res.status(500).send("Failed to Update exam data");
        }
    res.redirect("/exam");
    });
};

exports.questionPage = (req, res) => {
    const getSubjectsQuery = "SELECT * FROM course";
    const getQuestionsQuery = ` SELECT q.qid, q.qname,q.op1, q.op2, q.op3, q.op4, q.answer, c.cname 
    FROM question q
    JOIN coursequestionjoin cqj ON q.qid = cqj.qid
    JOIN course c ON cqj.cid = c.cid `;

    db.query(getSubjectsQuery, (err, subjects) => {
        if (err) {
            console.error("Error fetching subjects:", err);
            return res.status(500).send("Error loading page");
        }
        db.query(getQuestionsQuery, (err, questions) => {
            if (err) {
                console.error("Error fetching questions:", err);
                return res.status(500).send("Error loading page");
            }
            res.render("question.ejs", {
                subjects: subjects,
                questions: questions
            });
        });
    });
};

exports.addQuestion = (req, res) => 
{
  const { qname, op1, op2, op3, op4, answer, course_id } = req.body;
  const insertQuestion = `INSERT INTO question (qname, op1, op2, op3, op4, answer) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(insertQuestion, [qname, op1, op2, op3, op4, answer], (err, result) => 
    {
        if (err) return res.status(500).send("Error inserting question");
        const qid = result.insertId;
        const insertCourseJoin = `INSERT INTO coursequestionjoin (qid, cid) VALUES (?, ?)`;
        db.query(insertCourseJoin, [qid, course_id], (err2) => 
        {
            if (err2) return res.status(500).send("Error linking question to course");
            res.redirect("/question");
        });
    });
};

exports.deleteQuestion = (req, res) => {
    const qid = req.params.qid;
    db.query('DELETE FROM question WHERE qid = ?', [qid], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.redirect('/question'); 
    });
};

exports.schedulePage = (req, res) => {
  const getCourses = "SELECT * FROM course";
  const getExams = "SELECT * FROM exam";
  const getSchedules = `
    SELECT s.schid, s.date, s.starttime, s.endtime,
           c.cname,e.exname 
    FROM schedule s
    JOIN course c ON s.cid = c.cid
    JOIN exam e ON s.ex_id = e.ex_id
  `;
  db.query(getCourses, (err, subjects) => {
    if (err) return res.status(500).send("Error loading courses");
    db.query(getExams, (err, exams) => {
      if (err) return res.status(500).send("Error loading exams");
      db.query(getSchedules, (err, schedules) => {
        if (err) return res.status(500).send("Error loading schedules");
        res.render("schedule.ejs", {
          subjects: subjects,
          exams: exams,
          schedules: schedules
        });
      });
    });
  });
};

exports.scheduleAdd = (req, res) => 
{
    console.log("BODY DATA:", req.body);
  const { date, starttime, endtime, cid, ex_id } = req.body;
if (!date || !starttime || !endtime || !cid || !ex_id) {
  return res.status(400).send("Missing fields");
}
const sql = 'INSERT INTO schedule (date, starttime, endtime, cid, ex_id) VALUES (?, ?, ?, ?, ?)';
db.query(sql, [date, starttime, endtime, cid, ex_id], (err) => {
  if (err) return res.status(500).send("Database error");
   return res.redirect("/schedule");
});
};

exports.deleteSchedule = (req, res) => {
  const { schid } = req.params;
  db.query('DELETE FROM schedule WHERE schid = ?', [schid], (err) => {
    if (err) return res.status(500).send("Database error");
    res.redirect("/schedule");
  });
};

exports.getUpdateScheduleForm = (req, res) => {
  const { schid } = req.params;
  const getSchedule = "SELECT * FROM schedule WHERE schid = ?";
  const getCourses = "SELECT * FROM course";
  const getExams = "SELECT * FROM exam";
  db.query(getSchedule, [schid], (err, schedules) => {
    if (err || schedules.length === 0) return res.status(500).send("Schedule not found");
    db.query(getCourses, (err, subjects) => {
      if (err) return res.status(500).send("Error loading courses");
      db.query(getExams, (err, exams) => {
        if (err) return res.status(500).send("Error loading exams");
        res.render("updateSchedule.ejs", {
          schedule: schedules[0],
          subjects:subjects,
          exams:exams
        });
      });
    });
  });
};

exports.updateSchedule = (req, res) => {
  const { schid } = req.params;
  const { date, starttime, endtime, cid, ex_id } = req.body;
  const sql = 'UPDATE schedule SET date=?, starttime=?, endtime=?, cid=?, ex_id=? WHERE schid=?';
  db.query(sql, [date, starttime, endtime, cid, ex_id, schid], (err) => {
    if (err) return res.status(500).send("Database error");
    res.redirect("/schedule");
  });
};

exports.adminlogout=(req,res)=>{
    req.session.destroy(err=>{
        if(err) return res.send("logout error");
        res.redirect("/adminlogin");
    });
};

exports.studenthome = (req, res) => {
  if (!req.session.student) {
    return res.redirect("/studentlogin");
  }
  res.render("studentDashboard.ejs", { student: req.session.student });
};
