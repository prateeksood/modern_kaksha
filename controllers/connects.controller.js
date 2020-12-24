const connectsService = require("../services/connects.service");

const redeemConnects = async (req, res)=>{
    let data=req.user;
    data={...data,...req.body}
    try{
        connectsService.redeemConnects(data,(err, status, result)=>{
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
module.exports={redeemConnects};