const express=require("express");
const Message=require("../controller/message.controller");
const router = express.Router();

router.post("/postMessage",Message.postMessage);
router.get("/getMessage/:conversationId",Message.getMessage);

module.exports = router;