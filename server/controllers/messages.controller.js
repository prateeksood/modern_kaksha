const messagesService = require("../services/messages.service");


const saveMessage = async (req, res)=>{
    let data=req.body;
    try{
        messagesService.saveMessageService(data,(err, status, result)=>{
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

const retrieveSingleMessage = async (req, res)=>{
    let data=req.params.id;
    try{
        messagesService.retrieveMessagesByIdService(data,(err, status, result)=>{
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
const retrieveAllMessage = async (req, res)=>{
    
    try{
        messagesService.retrieveMessagesService((err, status, result)=>{
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
module.exports={saveMessage,retrieveAllMessage,retrieveSingleMessage};