const mongoose=require('mongoose'); 
  
const TeacherAdsSchema = new mongoose.Schema({ 
    name:{
        type:String,
        required:true,
    },
    ownerId:mongoose.Schema.Types.ObjectId,
    profilePicture:String,
    teachingMode:String,
    subject:Object,
    classGroups:[Object],
    discription:String,
    pincode:Number,
    teachingLocation:[Object],
    feesPeriod:String,
    feeAmount:Number,
    district:String,
    date:{
        type:Date,
        default:Date.now()
    },
    isAdActive:{
        type:Boolean,
        default:true
    },
    clicks:{
        type:Number,
        default:0
    }
}); 
  
module.exports = mongoose.model('TeacherAd', TeacherAdsSchema); 