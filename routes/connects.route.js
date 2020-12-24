const router = require("express").Router();
const connectsController =require( "../controllers/connects.controller");
const auth= require('../middlewares/auth');

router.post("/redeem", auth ,connectsController.redeemConnects);


module.exports = router;
