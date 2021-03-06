const teacherDao=require("../dao/teacher.dao");
const studentDao=require("../dao/student.dao");
const reviewDao=require("../dao/review.dao");
const ordersDao=require("../dao/orders.dao");

const retrieveTeachersService = async (data, callBack)=>{
    try{
        let result = await teacherDao.findTeachersByFilter(data);
        result.password=undefined;
        return callBack(null, 200 , result);
    }catch(err){
        console.log(err);
        return callBack(err.message, 500)
    }
}
const retrieveTeacherAdsByOwnerId= async (data, callBack)=>{
    try{
        let result = await teacherDao.findTeacherAdsByOwnerId(data);
        return callBack(null, 200 , result);
    }catch(err){
        console.log(err);
        return callBack(err.message, 500)
    }
}
const retrieveStudentsService = async (data, callBack)=>{
    try{
        let result = await studentDao.findStudentsByFilter(data);
        result.password=undefined;
        return callBack(null, 200 , result);
    }catch(err){
        console.log(err);
        return callBack(err.message, 500)
    }
}
const retrieveStudentAdsByOwnerId= async (data, callBack)=>{
    try{
        let result = await studentDao.findStudentAdsByOwnerId(data);
        return callBack(null, 200 , result);
    }catch(err){
        console.log(err);
        return callBack(err.message, 500)
    }
}
const retrieveReviewsService = async (data, callBack)=>{
    try{
        let result = await reviewDao.findReviewsByUserId(data);
        return callBack(null, 200 , result);
    }catch(err){
        console.log(err);
        return callBack(err.message, 500)
    }
}
const retrieveOrderService = async (callBack)=>{
    try{
        let result = await ordersDao.retrieveOrders();
        return callBack(null, 200 , result);
    }catch(err){
        console.log(err);
        return callBack(err.message, 500)
    }
}
module.exports={retrieveTeachersService,retrieveStudentsService,retrieveReviewsService,retrieveOrderService,retrieveTeacherAdsByOwnerId,retrieveStudentAdsByOwnerId};