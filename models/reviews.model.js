const mongoose=require('mongoose'); 
  
const ReviewSchema = new mongoose.Schema({ 
    reviewTitle:{
        type:String,
        required:true,
    },
    reviewBody:{
        type:String,
        required:true,
    },
    rating:{
        type:Number,
        required:true
    },
    targetUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    reviewerName:{
        type:String,
        required:true
    },
    reviewerId:{
        type:mongoose.Schema.Types.ObjectId
    },
    date:{
        type:Date,
        default:Date.now()
    }
}); 
  
module.exports = mongoose.model('Review', ReviewSchema); 