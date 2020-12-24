const router = require("express").Router();
const studentController =require( "../controllers/student.controller");
const auth= require('../middlewares/auth');
const {uploadProfilePicture}=require('../functions/imageUpload')

router.post("/register",uploadProfilePicture.single('profilePicture'),studentController.registerStudent);
router.post("/login", studentController.logInStudent);
router.put("/update",auth,studentController.updateStudent);
router.post("/", studentController.retrieveStudents);

module.exports = router;
