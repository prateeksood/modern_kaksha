const mongoose=require('mongoose'); 
  
const StudentSchema = new mongoose.Schema({ 
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
    studyingMode:String,
    subjects:[Object],
    discription:String,
    pincode:{
        type:Number
    },
    district:String,
    state:String,
    classOfStudy:Object,
    isActive:{
        type:Boolean,
        default:false
    },
    isStepOneDone:{
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
        default:'student'
    },
    isAdActive:{
        type:Boolean,
        default:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
}); 
  
module.exports = mongoose.model('Student', StudentSchema); 