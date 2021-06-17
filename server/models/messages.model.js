const mongoose=require('mongoose'); 
  
const MessagesSchema = new mongoose.Schema({ 
    name:{
        type:String,
        required:true,
    }, 
    email:{
        type:String,
        required:true
    },
    contactNumber:{
        type:Number,
        required:true,
    },
    message:String,
    type:{
        type:String,
        default:'contactMessage'
    },
    targetUser:mongoose.Schema.Types.ObjectId,
    reportingUser:mongoose.Schema.Types.ObjectId,
    reason:String,
    date:{
        type:Date,
        default:Date.now()
    }
}); 
  
module.exports = mongoose.model('Messages', MessagesSchema); 