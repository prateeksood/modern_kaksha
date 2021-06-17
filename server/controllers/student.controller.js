
const registerService = require("../services/register.service");
const logInService = require("../services/logIn.service");
const updateService =require("../services/update.service");
const retrieveService=require("../services/retrieve.service");
const registerStudent = async (req, res)=>{
    let data=req.body;
    if(req.file){
        data={...data,profilePicture:req.file.filename}
    }
    try{
        registerService.registerStudentService(data,(err, status, result)=>{
            if(!err){
                return res.status(status).json({error:null,result})
            }
            else{
                return res.status(status).json({error:err})
            }
        })
    }catch(err){
        return res.status(500).json({error:err.message});
    }
}
const updateStudent = async (req, res)=>{
    let data=req.body;
    try{
        updateService.updateStudentService(data,(err, status, result)=>{
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

const logInStudent = async (req, res)=>{
    let data=req.body;
    try{
        logInService.logInStudentService(data,(err, status, result)=>{
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
const retrieveStudents = async (req, res)=>{
    let data=req.body;
    try{
        retrieveService.retrieveStudentsService(data,(err, status, result)=>{
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
const getAdsByOwnerId = async (req, res)=>{
    let data=req.body;
    try{
        retrieveService.retrieveStudentAdsByOwnerId(data,(err, status, result)=>{
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
const updateAd = async (req, res)=>{
    let data=req.body;
    try{
        updateService.updateStudentAdService(data,(err, status, result)=>{
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
module.exports={registerStudent, updateStudent, logInStudent,retrieveStudents,getAdsByOwnerId,updateAd};