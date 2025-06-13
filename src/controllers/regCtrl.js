let regService=require("../services/regservice.js");
let regModel=require("../models/regModel.js");
const db = require("../config/db.js"); 

exports.navbar=(req,res)=>{
    res.render("nav.ejs");
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
    return res.redirect("/adminhome");
  }
  res.render("dashboard.ejs", { admin: req.session.admin });
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
        res.render("updatexam.ejs", { exam: results[0] }); // create this view
    });
};

exports.updatexam=(req,res)=>{
    const {ex_id}=req.params;
    const {exname,totalmark,passingmark}=req.body;
    const query="update exam set exname=? , totalmark=? , passingmark=? where ex_id=?";
    db.query(query,[exname,totalmark,passingmark.ex_id],(err,result)=>{
        if(err){
        console.error("Error Fetching exams",err);
        return res.status(500).send("Failed to Update exam data");
        }
    res.redirect("/exam");
    });
};

exports.adminlogout=(req,res)=>{
    req.session.destroy(err=>{
        if(err) return res.send("logout error");
        res.redirect("/adminlogin");
    });
};

