const Message=require("../model/message.model");
const User=require("../model/user.model");
exports.postMessage=async (req,res)=>{
 try{  
        const{conversationId,senderId,message}=req.body;
if(!senderId || !message){res.status(400).json("please fill all required fields")}
const newMessage =new Message({conversationId,senderId,message});
            await newMessage.save();
       res.status(201).json({data:newMessage,message:"Message added successfully"})
          }
       catch(err){
          res.status(500).json(`Internal Server Error ${err}`);
       }}

exports.getMessage=async (req,res)=>{
    try{  
           const conversationId=req.params.conversationId;
       if(!conversationId){res.status(200).json([])}
           const message = await Message.find({conversationId});
           const messageData = await Promise.all(message.map(async (message) => {
            const user = await User.findById(message.senderId);
            return {
          user:{  name:user.name,email:user.email},message:message.message       
            };
        }));
         res.status(200).json({data:messageData})
             }
          catch(err){
             res.status(500).json(`Internal Server Error ${err}`);
          }
   }