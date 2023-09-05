const Conversations =require("../model/conservation.model");
const User = require("../model/user.model");
exports.postConversation=async (req,res)=>{
 try{  
  const{senderId,receiverId}=req.body;
      const newConversation =new Conversations({members:[senderId,receiverId]});
      await newConversation.save();
res.status(201).json({data:newConversation,message:"new Conversation added"})
    }
 catch(err){
    res.status(500).json(`Internal Server Error ${err}`);
 }
}

exports.getConversation = async (req, res) => {
    try {
        const userId = req.params.userId; 
        const conversations = await Conversations.find({ members: { $in: [userId] } });
        const conversationData = await Promise.all(conversations.map(async (conversation) => {
            const receiverId = conversation.members.find(member => member !== userId);
            const receiverUser = await User.findById(receiverId);
            return {
                conversation: conversation,
                receiverUser: receiverUser
            };
        }));

        res.status(200).json({ data: conversationData, message: "conversations" });
    } catch (err) {
        res.status(500).json({ error: `Internal Server Error ${err}` });
    }
};