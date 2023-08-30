const express=require("express");
const User=require("../controller/user.controller");
const router = express.Router();


/// User///
//router.post("/uploadImage",userRoutes.uploadImage);
router.post("/signUp",User.signUp);
router.post("/signIn",User.signIn);
router.get("/getUser/:id",User.getUserById);
router.get("/getAllUser",User.getAllUsers);
router.put("/UserUpdate/:id",User.updateUserInfo);
router.delete("/deleteUser/:id",User.deleteUser);

router.post("/sendOtp",User.sendOTP);
router.post("/checkOtpVerify",User.checkOtpVerify);
router.get("/checkOtpExpiry/:id",User.checkOtpExpiry);
module.exports = router;