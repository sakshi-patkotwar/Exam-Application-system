const db = require("../config/db");
exports.dashboard = (req, res) => {
  res.render('studentDashboard');
};

exports.navbar=(req,res)=>{
  res.render("nav.ejs");
}

exports.studentRegister = (req, res) => {
  const { name, email, contact, password } = req.body;

  // Prepare to match your table's field names:
  // sname, semail, scontact, spassword
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
};

exports.studenthome = (req, res) => {
  if (!req.session.student) {
    return res.redirect("/studenthome");
  }
  res.render("studentdashboard.ejs", { student: req.session.student });
};