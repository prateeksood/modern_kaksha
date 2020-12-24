const mongoose = require('mongoose');
const Teacher = require('../models/teacher.model');
var cron = require('node-cron');

const findTeacherById=async (id)=>{
    try{
        let teacher= await Teacher.findById(new mongoose.Types.ObjectId(id));
        return teacher;
    }catch(err){
        throw Error(`Error while finding teacher : ${err.message}`);
    }
}
const findMultipleTeachersById=async (data)=>{
    let IDs=[];
    data.connectionIDs.forEach(id=>{
        IDs.push(new mongoose.Types.ObjectId(id));
    })
    try{
        let teachers= await Teacher.find({"_id":{"$in":IDs}})
        return teachers;
    }catch(err){
        console.log(err);
        throw Error(`Error while finding teachers : ${err.message}`);
    }
}
const findTeachersByParameter = async (params)=>{
    try{
        let teachers= await Teacher.find(params);
        return teachers;
    }catch(err){
        throw Error(`Error while finding teacher : ${err.message}`);
    }
}
const findTeachersByFilter=async (params)=>{
    let feesPeriod=params.feesPeriod;
    console.log(params);
    if(feesPeriod==='allfees'){
        feesPeriod=['hourly','monthly','daily'];
    }
    try{
        let query={};
        if(params.subjects.length<1&&(!params.pincodes[0]||params.pincodes[0].toString().length!==6)){
            query={
                "feesPeriod":{"$in":feesPeriod},
                "feeAmount":{
                    "$gte":params.minimumFees,
                    "$lte":params.maximumFees
                }
            }
        }
        else if(params.subjects.length<1){
            query={
                "feesPeriod":{"$in":feesPeriod},
                "feeAmount":{
                    "$gte":params.minimumFees,
                    "$lte":params.maximumFees
                },
                "pincode":{"$in":params.pincodes}
            }
        }
        else if((!params.pincodes[0]||params.pincodes[0].toString().length!==6)){
            query={
                "feesPeriod":{"$in":feesPeriod},
                "feeAmount":{
                    "$gte":params.minimumFees,
                    "$lte":params.maximumFees
                },
                "subjects":{"$in":params.subjects}
            }
        }
        
        else{
            query={
                "feesPeriod":{"$in":feesPeriod},
                "feeAmount":{
                    "$gte":params.minimumFees,
                    "$lte":params.maximumFees
                },
                "subjects":{"$in":params.subjects},
                "pincode":{"$in":params.pincodes}
            }
        }
        let skips = params.pageSize * (params.pageNumber - 1)
        let teachers = await Teacher.find({...query,isActive:true}).skip(skips).limit(params.pageSize).sort({"_id":-1});
        teachers.forEach(teacher=>{
            teacher.password=undefined;
        })
        return teachers;
    }catch(err){
        throw Error(`Error while finding teacher : ${err.message}`);
    }
}
const saveTeacher =async (data)=>{
    try{
        let newTeacher = new Teacher(data);
        let teacher = await newTeacher.save();
        return teacher;
    }catch(err){
        throw Error(`Error while creating teacher account : ${err.message}`);
    }
}
const updateTeacher =async (id,data)=>{
    try{
        let teacher= await Teacher.findByIdAndUpdate(id,data,{new: true});
        return teacher;
    }catch(err){
        throw Error(`Error while updating data: ${err.message}`);
    }

}
module.exports={findTeacherById,findTeachersByParameter,findTeachersByFilter,saveTeacher,updateTeacher,findMultipleTeachersById};