const mongoose = require('mongoose');
const Teacher = require('../models/teacher.model');
const TeacherAds = require('../models/teacherAds.model');
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
const findTeacherAdsByOwnerId=async (data)=>{
    console.log(data);
    try{
        let ads= await TeacherAds.find({"ownerId":new mongoose.Types.ObjectId(data.id)})
        return ads;
    }catch(err){
        console.log(err);
        throw Error(`Error while finding ads : ${err.message}`);
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
        feesPeriod=['hourly','monthly','daily','weekly'];
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
                "subject.value":{"$in":params.subjects.map(sub=>new RegExp(sub.value, "i"))}
            }
        }
        
        else{
            query={
                "feesPeriod":{"$in":feesPeriod},
                "feeAmount":{
                    "$gte":params.minimumFees,
                    "$lte":params.maximumFees
                },
                "subject.value":{"$in":params.subjects.map(sub=>new RegExp(sub.value, "i"))},
                "pincode":{"$in":params.pincodes}
            }
        }
        let skips = params.pageSize * (params.pageNumber - 1)
        let teachers = await TeacherAds.find(query).skip(skips).limit(params.pageSize).sort({"_id":-1});
        // console.log(teachers);
        return teachers;
    }catch(err){
        throw Error(`Error while finding teacher : ${err.message}`);
    }
}
const saveTeacher =async (data)=>{
    console.log(data);
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
        if(data.isActive){
            await TeacherAds.deleteMany({ownerId:id})
            teacher.subjects.forEach(async subject=>{
                teacher._doc._id=undefined;
                let ad={...teacher._doc,ownerId:id,subject:subject};
                let newTeacherAd=new TeacherAds(ad);
                await newTeacherAd.save();
            })
            teacher._doc._id=id;
        }
        return teacher;
    }catch(err){
        throw Error(`Error while updating data: ${err.message}`);
    }

}
const updateTeacherAd=async (id,data)=>{
    try{
        let teacherAd= await TeacherAds.findByIdAndUpdate(id,data,{new: true});
        return teacherAd;
    }catch(err){
        throw Error(`Error while updating data: ${err.message}`);
    }

}
module.exports={findTeacherById,findTeachersByParameter,findTeachersByFilter,saveTeacher,updateTeacher,findMultipleTeachersById,findTeacherAdsByOwnerId,updateTeacherAd};