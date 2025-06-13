let routes=require("express");
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
module.exports = router;