const mongoose=require('mongoose'); 
  
const StudentAdsSchema = new mongoose.Schema({ 
    name:{
        type:String,
        required:true,
    },
    ownerId:mongoose.Schema.Types.ObjectId,
    profilePicture:String,
    studyingMode:String,
    subject:Object,
    discription:String,
    pincode:{
        type:Number
    },
    district:String,
    classOfStudy:Object,
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
  
module.exports = mongoose.model('StudentAd', StudentAdsSchema); 