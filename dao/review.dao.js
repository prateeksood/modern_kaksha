const mongoose = require('mongoose');
const Review = require('../models/reviews.model');

const findReviewsByUserId = async (data)=>{
    try{
        let reviews= await Review.find({ targetUserId: new mongoose.Types.ObjectId(data.targetUserId)}).limit(10).sort({ "_id":-1});
        return reviews
    }catch(err){
        throw Error(`Error while finding reviews : ${err.message}`);
    }
}
const saveReview =async (data)=>{
    try{
        let newReview = new Review(data);
        let review = await newReview.save();
        return review;
    }catch(err){
        throw Error(`Error while creating review: ${err.message}`);
    }
}
const updateReview =async (id,data)=>{
    try{
        let review= await Review.findByIdAndUpdate(id,data,{new: true});
        return review;
    }catch(err){
        throw Error(`Error while updating review: ${err.message}`);
    }

}
module.exports={findReviewsByUserId,saveReview,updateReview};