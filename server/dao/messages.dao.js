const mongoose = require('mongoose');
const Messages = require('../models/messages.model');

const findMessageById = async (id)=>{
    try{
        let message= await Messages.find(id);
        return message
    }catch(err){
        throw Error(`Error while finding message : ${err.message}`);
    }
}
const saveMessage =async (data)=>{
    try{
        let newMessage = new Messages(data);
        let message = await newMessage.save();
        return message;
    }catch(err){
        throw Error(`Error while creating message: ${err.message}`);
    }
}
const findAllMessages = async ()=>{
    try{
        let messages= await Messages.find();
        return messages
    }catch(err){
        throw Error(`Error while finding messages : ${err.message}`);
    }
}
module.exports={findMessageById,saveMessage,findAllMessages};