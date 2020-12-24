require("dotenv").config();
const Razorpay = require("razorpay");
const updateService = require("../services/update.service");
const retrieveService =require("../services/retrieve.service")
const createOrder = async (req, res)=>{
    let data=req.body;
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });

        const options = {
            amount: data.price*100, 
            currency: "INR",
        };
        const order = await instance.orders.create(options);
        if (!order) return res.status(500).send("Some error occured");
        return res.status(200).json({error:null,order});
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }

}
const saveOrder = async (req, res)=>{
    let data=req.body;
    try{
        updateService.createOrderService(data,async (err, status, result)=>{
            if(!err){
                return res.status(status).json({error:null,result})
            }
            else{
                return res.status(status).json({error:err})
            }
        })
    }catch(err){
        return res.status(500).json({error:err.message})
    }
}
const retrieveOrders = async (req, res)=>{
    try{
        retrieveService.retrieveOrderService(data,(err, status, result)=>{
            if(!err){
                return res.status(status).json({error:null,result})
            }
            else{
                return res.status(status).json({error:err})
            }
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({error:err.message})
    }
}
const updateOrder = async (req, res)=>{
    let data=req.body;
    try{
        updateService.updateOrderService(data,(err, status, result)=>{
            if(!err){
                return res.status(status).json({error:null,result})
            }
            else{
                return res.status(status).json({error:err})
            }
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({error:err.message})
    }
}
module.exports={createOrder,retrieveOrders,updateOrder,saveOrder };