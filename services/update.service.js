require("dotenv").config();
const crypto = require('crypto');
const teacherDao=require("../dao/teacher.dao");
const studentDao=require("../dao/student.dao");
const reviewDao=require("../dao/review.dao");
const ordersDao=require("../dao/orders.dao");


const updateTeacherService = async (data, callBack)=>{
    try{
        let result = await teacherDao.updateTeacher(data._id,data);
        result.password=undefined;
        return callBack(null, 200 , result);
    }catch(err){
        console.log(err);
        return callBack(err.message, 500)
    }
}

const updateStudentService = async (data, callBack)=>{
    try{
        let result = await studentDao.updateStudent(data._id,data);
        result.password=undefined;
        return callBack(null, 200 , result);
    }catch(err){
        console.log(err);
        return callBack(err.message, 500)
    }
}
const reviewUserService = async (data, callBack)=>{
    try{
        let result = await reviewDao.saveReview(data);
        return callBack(null, 200 , result);
    }catch(err){
        console.log(err);
        return callBack(err.message, 500)
    }
}
const createOrderService = async (data, callBack)=>{
    const {
        orderCreationId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
    } = data;

    const shasum = crypto.createHmac("sha256",process.env.RAZORPAY_SECRET );

    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

    const digest = shasum.digest("hex");

    if (digest !== razorpaySignature){
        console.log('not legit');
        return callBack('Transaction is not legit', 400 );
    }
    

    try{
        let result = await ordersDao.saveOrder(data);
        let user = await teacherDao.findTeacherById(data.userId);
        if(user){
            ActiveCreditPurchases=[...user.ActiveCreditPurchases,{connects:data.connects,expiry:data.expiry}]
            await teacherDao.updateTeacher(data.userId,{ActiveCreditPurchases})
        }else{
            user = await studentDao.findStudentById(data.userId);
            ActiveCreditPurchases=[...user.ActiveCreditPurchases,{connects:data.connects,expiry:data.expiry}]
            await studentDao.updateStudent(data.userId,{ActiveCreditPurchases})
        }
        console.log(data.connects);
        return callBack(null, 200 , result);
    }catch(err){
        console.log(err);
        return callBack(err.message, 500)
    }

    
}
const updateOrderService= async (data, callBack)=>{
    try{
        let result = await ordersDao.updateOrder(data._id,data);
        return callBack(null, 200 , result);
    }catch(err){
        console.log(err);
        return callBack(err.message, 500)
    }
}
module.exports={updateTeacherService,updateStudentService,reviewUserService,createOrderService,updateOrderService };