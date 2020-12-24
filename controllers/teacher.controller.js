
const registerService = require("../services/register.service");
const logInService = require("../services/logIn.service");
const updateService =require("../services/update.service");
const retrieveService=require("../services/retrieve.service");
const registerTeacher = async (req, res)=>{
    let data=req.body;
    data={...data,profilePicture:req.file.filename};
    try{
        registerService.registerTeacherService(data,(err, status, result)=>{
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
const updateTeacher = async (req, res)=>{
    let data=req.body;
    console.log(req.file);
    if(req.files){
        if(req.files['educationCertificateFile']){
            data={...data,educationCertificateFile:req.files['educationCertificateFile'][0].filename}
        }
        if(req.files['profilePicture']){
            data={...data,educationCertificateFile:req.files['profilePicture'][0].filename}
        }
    }
    try{
        updateService.updateTeacherService(data,(err, status, result)=>{
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

const logInTeacher = async (req, res)=>{
    let data=req.body;
    try{
        logInService.logInTeacherService(data,(err, status, result)=>{
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
const retrieveTeachers = async (req, res)=>{
    let data=req.body;
    try{
        retrieveService.retrieveTeachersService(data,(err, status, result)=>{
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
module.exports={registerTeacher, updateTeacher, logInTeacher,retrieveTeachers};