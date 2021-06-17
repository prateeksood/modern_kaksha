const router = require("express").Router();
const Teacher=require('../models/teacher.model')
const teacherController =require( "../controllers/teacher.controller");
const multer  = require('multer')
const auth= require('../middlewares/auth');
const {uploadProfilePicture,uploadEducationCertificate}=require('../functions/imageUpload');
const teacherAdsModel = require("../models/teacherAds.model");

router.post("/register", uploadProfilePicture.single('profilePicture'),teacherController.registerTeacher);
router.post("/login", teacherController.logInTeacher);
router.put("/update", uploadEducationCertificate.fields([{ name: 'educationCertificateFile', maxCount: 1 }, { name: 'profilePicture', maxCount: 1}]),teacherController.updateTeacher);
router.post("/", teacherController.retrieveTeachers);
router.post('/getAdsByOwnerId',teacherController.getAdsByOwnerId)
router.put('/updateAd',teacherController.updateAd);

module.exports = router;
