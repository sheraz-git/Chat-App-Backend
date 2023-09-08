const express=require("express");
const Auth=require("../controller/auth.controller");
const router = express.Router();

/// Auth ///
router.post("/sendOtp",Auth.sendOTP);
router.post("/checkOtpVerify",Auth.checkOtpVerify);
router.get("/checkOtpExpiry/:id",Auth.checkOtpExpiry);


router.post("/forUserEmail",Auth.forUserEmail);
module.exports = router;