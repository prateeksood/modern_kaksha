require("dotenv").config();
const crypto = require('crypto');
const teacherDao=require("../dao/teacher.dao");
const studentDao=require("../dao/student.dao");
const reviewDao=require("../dao/review.dao");
const ordersDao=require("../dao/orders.dao");


const redeemConnects = async (data, callBack)=>{
    try{
        let result = await teacherDao.findTeacherById(data._id)
        if(result){
            let ActiveCreditPurchases=[];
            let firstFound=false;
            result.ActiveCreditPurchases.forEach((purchase,i)=>{
                if( (( new Date(purchase.expiry)-new Date())>0)&&!firstFound){
                    if(purchase.connects>0){
                        firstFound=true;
                        purchase.connects-=1;
                    } 
                }
                if( (( new Date(purchase.expiry)-new Date())>0)){
                    ActiveCreditPurchases.push(purchase);
                } 
            });
            
            if(!firstFound){
                return callBack('Sorry you do not have any connects left', 200 );
            }
            else{
                try{
                    let updatedTeacher = await teacherDao.updateTeacher(data._id,{ActiveCreditPurchases:ActiveCreditPurchases,connections:[...result.connections,data.targetUserId]})
                    console.log(updatedTeacher);
                    updatedTeacher.password=undefined;
                    return callBack(null, 200 , updatedTeacher);
                }
                catch(err){
                    console.log(err);
                    return callBack(err.message, 500);
                }
            } 
        }
        else{
            result = await studentDao.findStudentById(data._id);
            let ActiveCreditPurchases=[];
            let firstFound=false;
            result.ActiveCreditPurchases.forEach((purchase,i)=>{
                if( (( new Date(purchase.expiry)-new Date())>0)&&!firstFound){
                    if(purchase.connects>0){
                        firstFound=true;
                        purchase.connects-=1;
                    } 
                }
                if( (( new Date(purchase.expiry)-new Date())>0)){
                    ActiveCreditPurchases.push(purchase);
                } 
            });
            if(!firstFound){
                return callBack('Sorry you do not have sufficient credits to proceed', 200 );
            }
            else{
                try{
                    let updatedStudent = await studentDao.updateStudent(data._id,{ActiveCreditPurchases:ActiveCreditPurchases,connections:[...result.connections,data.targetUserId]})
                    updatedStudent.password=undefined;
                    return callBack(null, 200 , updatedStudent);
                }
                catch(err){
                    console.log(err);
                    return callBack(err.message, 500);
                }
            }
        }
    }catch(err){
        console.log(err);
        return callBack(err.message, 500)
    }
}
module.exports={redeemConnects};