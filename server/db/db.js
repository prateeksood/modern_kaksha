require('dotenv').config({path: '../../.env'});
const mongoose = require('mongoose');

const connectToDB=async ()=>{
    const url = 'mongodb+srv://deltaEducators:ifeelarush343@delta-educators.wgkff.mongodb.net/deltaEducators?retryWrites=true&w=majority';

    try{
        const db=(await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false,useCreateIndex: true })).Connection;
        console.log('Connected to database');
    }
    catch(err){
        console.log(err);
    }
}
module.exports ={connectToDB}