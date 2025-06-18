let routes=require("express");
let regCtrl=require("../controllers/regCtrl.js");
let router=routes.Router();

router.get("/",regCtrl.navbar);
router.get("/adminlogin",regCtrl.adminlog);
router.post("/adminlogin",regCtrl.adminlogin);
router.get("/adminhome",regCtrl.adminhome);
router.get("/adminlogout",regCtrl.adminlogout);

router.get("/adminadd",regCtrl.admin);

//student
router.get("/studentlogin",regCtrl.studentlog);
router.post("/studentlogin",regCtrl.studentlogin);
router.get("/studenthome", regCtrl.studenthome); 
router.get("/register", (req, res) => {
  res.render("register.ejs", { msg: "" }); 
});
router.post("/register", regCtrl.studentRegister);

//subject
router.get("/subject",regCtrl.addcourse);
router.post("/addcourse",regCtrl.insertcourse);
router.get("/addcourse",regCtrl.deletesubject);
router.get("/deletecourse/:cid",regCtrl.deletesubject);

//exam
router.get("/exam",regCtrl.addexam);
router.post("/addexam",regCtrl.insertexam);
router.get("/addexam",regCtrl.deletexam);
router.get("/deletexam/:ex_id",regCtrl.deletexam);
router.get("/updateExam/edit/:ex_id",regCtrl.getUpdateExamForm);
router.post("/updateExam/:ex_id", regCtrl.updateExam);

//question
router.get("/question", regCtrl.questionPage);
router.post("/questions/add", regCtrl.addQuestion);
router.get("/questions/add",regCtrl.deleteQuestion);
router.get("/questions/delete/:qid", regCtrl.deleteQuestion);

//schedule
router.get("/schedule",regCtrl.schedulePage);
router.get("/schedule/add", regCtrl.schedulePage);
router.post("/schedule", regCtrl.scheduleAdd);
router.get("/schedule/delete/:schid", regCtrl.deleteSchedule);
router.get("/schedule/edit/:schid", regCtrl.getUpdateScheduleForm);
router.post("/schedule/update/:schid", regCtrl.updateSchedule);

router.post("/schedule/add",regCtrl.scheduleAdd);

module.exports = router;

