const express = require("express");
const router = express.Router();
const regCtrl = require("../controllers/regCtrl");
const db = require("../config/db");

router.get("/",regCtrl.navbar);

// Redirect root to dashboard
router.get("/", (req, res) => {
  res.redirect("/dashboard");
});

router.get("/",regCtrl.navbar);

// Admin dashboard
router.get("/dashboard", regCtrl.dashboard);

router.get("/", (req, res) => {
  res.redirect("/register");
});

// Student Registration page
router.get("/register", (req, res) => {
  res.render("register.ejs", {msg: ''}); // Loading form first
});

// Handle Student Registration submission
router.post("/register", regCtrl.studentRegister);


// Student Login Page
router.get("/studentlogin", regCtrl.studentlog);

// Handle student login form submission
router.post("/studentlogin", regCtrl.studentlogin);

router.get("/studentlogin",regCtrl.studentRegister);

// Student Dashboard
router.get("/studenthome", regCtrl.studenthome);

router.get("/register",regCtrl.studentRegister);
module.exports = router;
