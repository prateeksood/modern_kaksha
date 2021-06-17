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
const PORT=process.env.PORT || 5000

const app=express();
db.connectToDB();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use('/api/uploads',express.static(path.join(__dirname,'/uploads')));
// app.use(express.static(path.join(__dirname, 'client/build')))
app.use('/api/teachers',teachersRoute );
app.use('/api/students',studentsRoute );
app.use('/api/reviews',reviewsRoute );
app.use('/api/auth',authRoute );
app.use('/api/orders',ordersRoute);
app.use('/api/connects',connectsRoute);
app.use('/api/messages',messagesRoute);

app.use(express.static("client/build"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
});

app.listen(PORT,()=>{
    console.log(`server started at PORT ${PORT}`);
})