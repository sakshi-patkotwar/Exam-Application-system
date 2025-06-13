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
        res.render("admin.ejs", { admin: results }); // ✅ pass admin data to view
    });
};

exports.adminlogout=(req,res)=>{
    req.session.destroy(err=>{
        if(err) return res.send("logout error");
        res.redirect("/adminlogin");
    });
};

