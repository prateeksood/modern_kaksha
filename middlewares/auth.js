const jwt=require('jsonwebtoken');
require('dotenv').config({path: '../.env'});

const auth=(req,res,next)=>{
    const token=req.header('x-auth-token');
    if(!token) res.status(401).json({error:'Token not found, access denied'})
    else{
        try{
            const decode=jwt.verify(token,process.env.JWT_SECRET)
            req.user=decode;
            next();
        }catch(err){
            res.status(400).json({error:err.message})
        }
    }
    
}
module.exports=auth;