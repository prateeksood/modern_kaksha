const messagesDao=require("../dao/messages.dao");

const retrieveMessagesByIdService = async (data, callBack)=>{
    try{
        let result = await messagesDao.findMessagesId(data);
        return callBack(null, 200 , result);
    }catch(err){
        console.log(err);
        return callBack(err.message, 500)
    }
}
const retrieveMessagesService = async (data, callBack)=>{
    try{
        let result = await messagesDao.findMessagesId(data);
        return callBack(null, 200 , result);
    }catch(err){
        console.log(err);
        return callBack(err.message, 500)
    }
}
const saveMessageService = async (data,callBack)=>{
    try{
        let savedMessage = await messagesDao.saveMessage(data);
        let result={
            message: "Message successfully created",
            savedMessage
        }
        return callBack(null, 200 , result);
    }catch(err){
        console.log(err);
        return callBack(err.message, 500)
    }
}
module.exports={retrieveMessagesService,saveMessageService,retrieveMessagesByIdService};