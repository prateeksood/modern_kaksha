const router = require("express").Router();
const teacherController =require( "../controllers/teacher.controller");
const multer  = require('multer')
const auth= require('../middlewares/auth');
const {uploadProfilePicture,uploadEducationCertificate}=require('../functions/imageUpload')

router.post("/register", uploadProfilePicture.single('profilePicture'),teacherController.registerTeacher);
router.post("/login", teacherController.logInTeacher);
router.put("/update", uploadEducationCertificate.fields([{ name: 'educationCertificateFile', maxCount: 1 }, { name: 'profilePicture', maxCount: 1}]),teacherController.updateTeacher);
router.post("/", teacherController.retrieveTeachers);

module.exports = router;
