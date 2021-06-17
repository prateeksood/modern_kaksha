const teacherDao=require("../dao/teacher.dao");
const studentDao=require("../dao/student.dao");
const bcrypt=require("bcryptjs")

const authenticateUserService = async (data, callBack)=>{
    try{
        let result = await teacherDao.findTeacherById(data._id);
        if(result){
            result.password=undefined;
        }
        else{
            result = await studentDao.findStudentById(data._id);
            if(result){
                result.password=undefined;
            }
            else{
                return callBack(null, 200 , result);
            }
        }
        let connects=0;
        result.ActiveCreditPurchases.forEach(purchase=>{
            if( ( new Date(purchase.expiry)-new Date())>0){
                connects+=purchase.connects;
            }
        })
        if(connects>5000000){
            result.connectsLeft='Unlimited';
        }
        else{
            result.connectsLeft=connects;
        }
        return callBack(null, 200 , result);
    }catch(err){
        console.log(err);
        return callBack(err.message, 500);
    }
}
const findUsersById = async (data, callBack)=>{
    try{
        let results = await teacherDao.findMultipleTeachersById(data);
        let response=[]
        if(results.length>0){
            results.forEach(result=>{
                result.password=undefined;
                response.push({name:result.name,_id:result._id})
            })  
        }
        else{
            results = await studentDao.findMultipleStudentsById(data);
            results.forEach(result=>{
                result.password=undefined;
                response.push({name:result.name,_id:result._id})
            })
        }
        results=response;
        return callBack(null, 200 , results);
    }catch(err){
        console.log(err);
        return callBack(err.message, 500);
    }
}
const verifyUserEmailService = async (data, callBack)=>{
    try{
        let result = await teacherDao.findTeacherById(data._id);
        if(result){
            result.password=undefined;
        }
        else{
            result = await studentDao.findStudentById(data._id);
            result.password=undefined;
        }
        bcrypt
        .compare(data.token,result.token)
        .then(async (isMatch)=>{   
            if(isMatch){
                let result = await teacherDao.updateTeacher(data._id,{token:undefined,isVerified:true});
                if(result){
                    result.password=undefined;
                }
                else{
                    result = await studentDao.updateStudent(data._id,{token:undefined,isVerified:true});
                    result.password=undefined;
                }
                return callBack(null, 200 , result);
            }
            else{
                return callBack('Invalid OTP', 200)
            }
        })
        .catch(err=>console.log(err))
    }catch(err){
        console.log(err);
        return callBack(err.message, 500);
    }
}
module.exports={authenticateUserService,verifyUserEmailService,findUsersById};