const router = require("express").Router();
const orderController =require( "../controllers/orders.controller");
const auth =require('../middlewares/auth')
router.post("/",auth,orderController.createOrder);
router.post("/success",auth,orderController.saveOrder);
router.get("/",orderController.retrieveOrders);
router.put("/",orderController.updateOrder);

module.exports = router;
