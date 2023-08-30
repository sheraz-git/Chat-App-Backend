const mongoose = require('mongoose');
const mongodb = require("mongodb").MongoClient;
      // waqas db
     // mongodb+srv://waqas:waqas123@cluster0.d5key9b.mongodb.net//
async function connectToMongo() {
  
    try {
      await mongoose.connect("mongodb+srv://waqas:waqas123@cluster0.d5key9b.mongodb.net/", { useNewUrlParser: true });
      console.log('Connected to MongoDB');
    } catch (err) {
       console.error('Error connecting to MongoDB', err);
    }
  }
  
module.exports = connectToMongo;
