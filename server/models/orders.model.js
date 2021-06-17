const mongoose=require('mongoose'); 
  
const OrderSchema = new mongoose.Schema({ 
    date:{
        type:Date,
        default:Date.now()
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    connects:Number,
    planName:String,
    duration:Number,
    expiry:{
        type:Date
    },
    price:Number,
    razorpayPaymentId:String,
    razorpayOrderId:String,
});

module.exports = mongoose.model('Order', OrderSchema);