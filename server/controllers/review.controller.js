const updateService = require("../services/update.service");
const retrieveService =require("../services/retrieve.service")
const reviewUser = async (req, res)=>{
    let data=req.body;
    try{
        updateService.reviewUserService(data,(err, status, result)=>{
            if(!err){
                return res.status(status).json({error:null,result})
            }
            else{
                return res.status(status).json({error:err})
            }
        })
    }catch(err){
        return res.status(500).json({error:err.message})
    }
}

const retrievReviews = async (req, res)=>{
    let data=req.query;
    try{
        retrieveService.retrieveReviewsService(data,(err, status, result)=>{
            if(!err){
                return res.status(status).json({error:null,result})
            }
            else{
                return res.status(status).json({error:err})
            }
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({error:err.message})
    }
}
module.exports={reviewUser,retrievReviews};