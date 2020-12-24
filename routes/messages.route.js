const router = require("express").Router();
const messageController =require( "../controllers/messages.controller");

router.post("/",messageController.saveMessage);
router.get("/",messageController.retrieveAllMessage);
router.get("/:id",messageController.retrieveSingleMessage);


module.exports = router;
