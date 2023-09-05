const express=require("express");
const Conversation=require("../controller/conversation.controller");
const router = express.Router();
/// Conversation///
router.post("/postConversation",Conversation.postConversation);
router.get("/getConversation/:userId",Conversation.getConversation);
module.exports = router;