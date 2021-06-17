const router = require("express").Router();
const reviewController =require( "../controllers/review.controller");

router.post("/",reviewController.reviewUser);
router.get("/",reviewController.retrievReviews);

module.exports = router;
