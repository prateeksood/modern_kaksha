require('dotenv').config({path: '../.env'});
const mongoose = require('mongoose');

const connectToDB=async ()=>{
    const url = process.env.MONGO_URI;

    try{
        const db=(await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false,useCreateIndex: true })).Connection;
        console.log('Connected to database');
    }
    catch(err){
        console.log(err);
    }
}
module.exports ={connectToDB}