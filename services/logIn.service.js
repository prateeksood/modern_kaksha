require('dotenv').config({path: '../.env'});
const teacherDao = require("../dao/teacher.dao")
const studentDao = require("../dao/student.dao")
const bcrypt=require("bcrypt")
const jwt = require("jsonwebtoken");

const logInTeacherService = async (data,callBack)=>{

    const { email, password } = data;
    const foundTeacher=await teacherDao.findTeachersByParameter({email})
    if (foundTeacher.length>0) {
        bcrypt
        .compare(password, foundTeacher[0].password)
        .then(isMatched => {
            if (isMatched) {
                jwt.sign({ _id: foundTeacher[0]._id }, process.env.JWT_SECRET,{ expiresIn: 31536000 },(err, token) => {
                    
                    if (err) {return callBack(err, 400)};
                    foundTeacher[0].password=undefined;
                    let connects=0;
                    foundTeacher[0].ActiveCreditPurchases.forEach(purchase=>{
                       if( ( new Date(purchase.expiry)-new Date())>0){
                            connects+=purchase.connects;
                       }
                    })
                    if(connects>5000000){
                        foundTeacher[0].connectsLeft='Unlimited';
                    }
                    else{
                        foundTeacher[0].connectsLeft=connects;
                    }
                    let result={
                        message: "Login Successful",
                        token,
                        user: foundTeacher[0]
                    };
                    return callBack(null, 200 , result);
                });
            } 
            else {
                return callBack('Invalid Password', 200)
            }
        })
        .catch(err =>
        {
            console.log(err);
            return callBack(err.message, 500)
        }
        );
    } 
    else {
        return callBack('Invalid Email Address', 200)
    }
}

const logInStudentService = async (data,callBack)=>{

    const { email, password } = data;
    const foundStudent=await studentDao.findStudentsByParameter({email})
    if (foundStudent.length>0) {
        bcrypt
        .compare(password, foundStudent[0].password)
        .then(isMatched => {
            if (isMatched) {
                jwt.sign({ _id: foundStudent[0]._id }, process.env.JWT_SECRET,{ expiresIn: 31536000 },(err, token) => {
                    
                    if (err) {return callBack(err, 400)};
                    foundStudent[0].password=undefined;
                    let connects=0;
                    foundStudent[0].ActiveCreditPurchases.forEach(purchase=>{
                       if( ( new Date(purchase.expiry)-new Date())>0){
                            connects+=purchase.connects;
                       }
                    })
                    if(connects>5000000){
                        foundStudent[0].connectsLeft='Unlimited';
                    }
                    else{
                        foundStudent[0].connectsLeft=connects;
                    }
                    let result={
                        message: "Login successful",
                        token,
                        user: foundStudent[0]
                    };
                    return callBack(null, 200 , result);
                });
            } 
            else {
                return callBack('Invalid Password', 200)
            }
        })
        .catch(err =>
        {return callBack(err.message, 500)}
        );
    } 
    else {
        return callBack('Invalid Email Address', 200)
    }
}
module.exports = {logInStudentService,logInTeacherService};