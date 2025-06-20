let routes=require("express");
const conn = require('../config/db'); 
let regCtrl=require("../controllers/regCtrl.js");
let router=routes.Router();

router.get("/",regCtrl.navbar);
router.get("/adminlogin",regCtrl.adminlog);
router.post("/adminlogin",regCtrl.adminlogin);
router.get("/adminhome",regCtrl.adminhome);
router.get("/adminlogout",regCtrl.adminlogout);
router.get("/subject",regCtrl.addcourse);
router.post("/addcourse",regCtrl.insertcourse);
router.get("/addcourse",regCtrl.deletesubject);
router.get("/deletecourse/:cid",regCtrl.deletesubject);
router.get("/adminadd",regCtrl.admin);

router.get("/viewstud", regCtrl.viewStudent);

function isStudentLoggedIn(req, res, next) {
  if (!req.session.student) {
    return res.redirect('/studentlogin');
  }
  next();
}


router.get('/register', regCtrl.getRegisterPage);

router.post("/register", regCtrl.registerStudentFull); 

// Show registration page
router.get('/loginregister', regCtrl.showRegister);

// Handle form submission
router.post('/loginregister', regCtrl.registerStudent);


router.get("/student/:id", regCtrl.getStudentById); 

router.get("/studentlogin", regCtrl.studentlog);
router.post("/studentlogin", regCtrl.studentlogin);


router.get("/studenthome", regCtrl.studenthome);
//router.get('/loginregister', regCtrl.showRegister);

// Route to show student registration page (sign up)
router.get('/register', regCtrl.getRegisterPage);

// Route to handle full student registration (sign up form)
router.post('/register', regCtrl.registerStudentFull);

// Route to show exam registration form with auto-filled student data
router.get('/loginregister', isStudentLoggedIn, regCtrl.showRegister);

// Route to register student for selected schedule
router.post('/loginregister', isStudentLoggedIn, regCtrl.registerStudent);

router.get("/registration/view", isStudentLoggedIn, regCtrl.viewRegistrationDetails);

router.get("/start", isStudentLoggedIn, regCtrl.start);
router.post("/startexam", regCtrl.submitExam); // <-- Define this

router.post("/startexam", regCtrl.start); 
router.post("/submitexam",regCtrl.submitExam);

// router.post("/submitanswers", regCtrl.submitAnswers);

router.get("/home",regCtrl.navbar);

module.exports = router;