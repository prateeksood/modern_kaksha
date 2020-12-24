const mongoose=require('mongoose'); 
  
const TeacherSchema = new mongoose.Schema({ 
    name:{
        type:String,
        required:true,
    }, 
    email:{
        type:String,
        required:true,
        unique:true
    },
    contactNumber:{
        type:Number,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    profilePicture:String,
    aadhaarNumber:{
        type:Number
    },
    teachingMode:String,
    subjects:[String],
    classGroups:[String],
    requirementOfCertificate:Boolean,
    educationCertificateFile:String,
    highestLevelOfEducation:String,
    pincode:Number,
    teachingLocation:[String],
    address:String,
    instituteName:String,
    feesPeriod:String,
    feeAmount:Number,
    accounNumer:String,
    ifscCode:String,
    accountHolderName:String,
    isActive:{
        type:Boolean,
        default:false
    },
    isStepOneDone:{
        type:Boolean,
        default:false
    },
    isStepTwoDone:{
        type:Boolean,
        default:false
    },
    ActiveCreditPurchases:{
        type:[Object],
        default:[{
            connects:5,
            expiry:(new Date(new Date().getFullYear(),new Date().getMonth() +3, new Date().getDate()))
        }]
    },
    connectsLeft:{
        type:String,
        default:0
    },
    connections:{
        type:[mongoose.Schema.Types.ObjectId]
    },
    district:String,
    state:String,
    date:{
        type:Date,
        default:Date.now()
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    token:String,
    accountType:{
        type:String,
        default:'teacher'
    }
}); 
  
module.exports = mongoose.model('Teacher', TeacherSchema); 