const mongoose = require('mongoose');
const Student = require('../models/student.model');
const studentAdsModel = require('../models/studentAds.model');

const findStudentById=async (id)=>{
    try{
        let student= await Student.findById(new mongoose.Types.ObjectId(id));
        return student;
    }catch(err){
        throw Error(`Error while finding student : ${err.message}`);
    }
}
const findMultipleStudentsById=async (data)=>{
    try{
        let students= await Student.find({"_id":{"$in":data.connectionIDs}
        })
        return students;
    }catch(err){
        throw Error(`Error while finding students : ${err.message}`);
    }
}
const findStudentAdsByOwnerId=async (data)=>{
    console.log(data);
    try{
        let ads= await studentAdsModel.find({"ownerId":new mongoose.Types.ObjectId(data.id)})
        return ads;
    }catch(err){
        console.log(err);
        throw Error(`Error while finding ads : ${err.message}`);
    }
}
const findStudentsByParameter = async (params)=>{
    try{
        let students= await Student.find(params);
        return students;
    }catch(err){
        throw Error(`Error while finding student : ${err.message}`);
    }
}
const findStudentsByFilter=async (params)=>{
    
    try{
        let query={};
        if(params.subjects.length<1&&(!params.pincodes[0]||params.pincodes[0].toString().length!==6)){
            query={}
        }
        else if(params.subjects.length<1){
            query={
                "pincode":{"$in":params.pincodes}
            }
        }
        else if((!params.pincodes[0]||params.pincodes[0].toString().length!==6)){
            query={
                "subject.value":{"$in":params.subjects.map(sub=>new RegExp(sub.value, "i"))}
            }
        }
        else{
            query={
                "subject.value":{"$in":params.subjects.map(sub=>new RegExp(sub.value, "i"))},
                "pincode":{"$in":params.pincodes}
            }
        }
        let skips = params.pageSize * (params.pageNumber - 1)
        let students= await studentAdsModel.find(query).skip(skips).limit(params.pageSize).sort({"_id":-1});
        
        return students;
    }catch(err){
        throw Error(`Error while finding student : ${err.message}`);
    }
}
const saveStudent =async (data)=>{
    try{
        let newStudent = new Student(data);
        let student = await newStudent.save();
        return student;
    }catch(err){
        throw Error(`Error while creating student account : ${err.message}`);
    }
}
const updateStudent =async (id,data)=>{
    try{
        let student= await Student.findByIdAndUpdate(id,data,{new: true});
        if(data.isStepOneDone){
            await studentAdsModel.deleteMany({ownerId:id})
            student.subjects.forEach(async subject=>{
                student._doc._id=undefined;
                let ad={...student._doc,ownerId:id,subject:subject};
                let newStudentAd=new studentAdsModel(ad);
                await newStudentAd.save();
            })
            student._doc._id=id;
        }
        return student;
    }catch(err){
        throw Error(`Error while updating data: ${err.message}`);
    }

}
const updateStudentAd=async (id,data)=>{
    try{
        let studentAd= await studentAdsModel.findByIdAndUpdate(id,data,{new: true});
        return studentAd;
    }catch(err){
        throw Error(`Error while updating data: ${err.message}`);
    }

}
module.exports={findStudentById,findStudentsByParameter,findStudentsByFilter,saveStudent,updateStudent,findMultipleStudentsById,findStudentAdsByOwnerId,updateStudentAd};