const multer =require("multer");
const path = require('path')


const profilePictureStorage=multer.diskStorage({
    destination:(req,file,callBack)=>{
        callBack(null,'./uploads/profilePictures');
    },
    filename:(req,file,callBack)=>{
        callBack(null,`ProfilePic-${Date.now()}${path.extname(file.originalname)}`)
    }
});

const educationCertificateStorage=multer.diskStorage({
    destination:(req,file,callBack)=>{
        callBack(null,'./uploads/certificates');
    },
    filename:(req,file,callBack)=>{
        callBack(null,`Certificate-${Date.now()}${path.extname(file.originalname)}`)
    }
});

const uploadProfilePicture=multer({storage:profilePictureStorage});
const uploadEducationCertificate=multer({storage:educationCertificateStorage})
module.exports={uploadProfilePicture,uploadEducationCertificate};