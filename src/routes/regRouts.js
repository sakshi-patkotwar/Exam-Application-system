let routes=require("express");
let regCtrl=require("../controllers/regCtrl.js");
let router=routes.Router();

router.get("/",regCtrl.navbar);
router.get("/adminlogin",regCtrl.adminlog);
router.post("/adminlogin",regCtrl.adminlogin);

router.get("/adminhome",regCtrl.adminhome);
router.get("/adminlogout",regCtrl.adminlogout);

//subject
router.get("/subject",regCtrl.addcourse);
router.post("/addcourse",regCtrl.insertcourse);
router.get("/addcourse",regCtrl.deletesubject);
router.get("/deletecourse/:cid",regCtrl.deletesubject);

router.get("/adminadd",regCtrl.admin);

//exam
router.get("/exam",regCtrl.addexam);
router.post("/addexam",regCtrl.insertexam);
router.get("/addexam",regCtrl.deletexam);
router.get("/deletexam/:ex_id",regCtrl.deletexam);
//router.get("/addexam",regCtrl.updatexam);
router.get("/updatexam/:ex_id",regCtrl.getUpdateExamForm);
router.post("/updatexam/:ex_id",regCtrl.updatexam);


module.exports = router;