const router = require("express").Router();
const authController =require( "../controllers/auth.controller");
const multer  = require('multer')
const upload = multer({ dest: '../images/' })
const auth= require('../middlewares/auth');

router.get("/", auth ,authController.authUser);
router.get("/find-by-id",authController.findUserById);
router.post("/find-multiple-by-id",authController.findUsersById);
router.post("/verify-email",auth,authController.verifyUserEmail);
router.get("/send-verification-email",auth,authController.sendVerificationEmail);


module.exports = router;
