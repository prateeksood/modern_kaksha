
const authService = require("../services/auth.service");
const registerService = require("../services/register.service");

const authUser = async (req, res)=>{
    let data=req.user;
    try{
        authService.authenticateUserService(data,(err, status, result)=>{
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
const findUserById= async (req, res)=>{
    let data=req.query;
    try{
        authService.authenticateUserService(data,(err, status, result)=>{
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
const findUsersById= async (req, res)=>{
    let data=req.body;
    try{
        authService.findUsersById(data,(err, status, result)=>{
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
const verifyUserEmail = async (req, res)=>{
    let data=req.user;
        data={...data,token:req.body.otp}
    try{
        authService.verifyUserEmailService(data,(err, status, result)=>{
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
const sendVerificationEmail = async (req, res)=>{
    let data=req.user;
    try{
        registerService.sendVerificationEmail(data,(err, status, result)=>{
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
module.exports={authUser,findUserById,verifyUserEmail,sendVerificationEmail,findUsersById};