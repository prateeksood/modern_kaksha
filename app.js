require('dotenv').config();
const express=require('express');
const path = require('path');
const cors=require('cors');
const db= require('./db/db');
const teachersRoute =require("./routes/teachers.route");
const studentsRoute =require("./routes/students.route");
const reviewsRoute =require("./routes/reviews.route");
const authRoute =require("./routes/auth.route");
const ordersRoute =require("./routes/orders.route");
const connectsRoute =require("./routes/connects.route");
const messagesRoute =require("./routes/messages.route");
const PORT=process.env.PORT || 2700

const app=express();
db.connectToDB();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(function (err, req, res, next) {
    console.log('This is the invalid field ->', err.field)
    next(err)
  })
app.use('/uploads',express.static('uploads'));
app.use(express.static(path.join(__dirname, 'client/build')))
app.use('/api/teachers',teachersRoute );
app.use('/api/students',studentsRoute );
app.use('/api/reviews',reviewsRoute );
app.use('/api/auth',authRoute );
app.use('/api/orders',ordersRoute);
app.use('/api/connects',connectsRoute);
app.use('/api/messages',messagesRoute);
app.listen(PORT,()=>{
    console.log(`server started at PORT ${PORT}`);
})