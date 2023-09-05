const mongoose = require("mongoose");
const Message = new mongoose.Schema({
  conversationId: {
    type: String,
      },
   senderId:{
    type: String
   },   
   message:{
    type: String
   }   
});

const message = mongoose.model("Message", Message);
module.exports = message;
