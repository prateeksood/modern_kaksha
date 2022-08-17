require('dotenv').config();
const mongoose = require('mongoose');

const connectToDB = async () => {
  const url = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.xjyed.mongodb.net/delta-educators?retryWrites=true&w=majority`;

  try {
    const db = (await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })).Connection;
    console.log('Connected to database');
  }
  catch (err) {
    console.log(err);
  }
}
module.exports = { connectToDB }