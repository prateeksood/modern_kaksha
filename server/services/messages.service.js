const messagesDao=require("../dao/messages.dao");
const nodemailer = require("nodemailer");

const retrieveMessagesByIdService = async (data, callBack)=>{
    try{
        let result = await messagesDao.findMessagesId(data);
        return callBack(null, 200 , result);
    }catch(err){
        console.log(err);
        return callBack(err.message, 500)
    }
}
const retrieveMessagesService = async (callBack)=>{
    try{
        let result = await messagesDao.findAllMessages();
        return callBack(null, 200 , result);
    }catch(err){
        console.log(err);
        return callBack(err.message, 500)
    }
}
const saveMessageService = async (data,callBack)=>{
    try{
        let savedMessage = await messagesDao.saveMessage(data);
        try {
            // let testAccount = await nodemailer.createTestAccount();
            let transporter = nodemailer.createTransport({
                host: "smtpout.secureserver.net",
                port: 465,
                secure: true,
                auth: {
                    user: "support@modernkaksha.com",
                    pass: "Obeygod@1",
                },
                tls: { rejectUnauthorized: false },
            });
    
            let info = await transporter.sendMail({
                from: '"Modern Kaksha" <support@modernkaksha.com>',
                to: 'support@modernkaksha.com',
                subject: `Recieved a message from ${data.name}`,
                html: `
                    <div>${data.name}:</div>
                    <p>${data.message}</p>
                    <hr>
                    <h3>Conatct Information</h3>
                    <p><b>Email : </b> ${data.email}</p>
                    <p><b>Contact : </b> ${data.contactNumber}</p>
                `
            });
            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        } catch (err) {
            console.log(err);
            return false;
        }
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