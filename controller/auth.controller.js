const User = require("../model/user.model");
const moment = require("moment");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");

// send Otp//
exports.sendOTP = async (req, res) => {
  try {
    const { userId } = req.body;
    const new_otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
const otp_expiry_time = moment().add(1, "minutes");
const user = await User.findByIdAndUpdate(userId, {
  otp_expiry_time: otp_expiry_time.toISOString(),
});
user.otp = new_otp.toString();
    await user.save();
// create reusable transporter object using the default SMTP transport
    let transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "sherazabbas669@gmail.com",
        pass: "dyoonnvupsqlgzjy",
      },
    });
    let mailOptions = {
      to: user.email,
      subject: "Verification OTP",
      html: `Hello ${user.name}, your OTP is ${new_otp}`,
    };
    // send email with defined transport object
    let info = await transport.sendMail(mailOptions);
    res.status(200).json({
      status: "success",
      message: "OTP Sent Successfully!",
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send email");
  }
};

exports.checkOtpVerify = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findOne({ otp });
    if (!user) {
      return res.status(409).json({ message: "Incorrect Otp" });
    }
    const currentTime = moment();
    const otpExpiryTime = moment(user.otp_expiry_time);
    if (currentTime.isAfter(otpExpiryTime)) {
      // OTP has expired, delete the user data
     // await User.findByIdAndDelete(user._id);
      return res.status(400).json({ message: "OTP has expired"});
    }
    res.status(200).json({ data: user,message:"Otp verified successfully"});
  } catch (err) {
    res.status(500).json(`Internal Server Error ${err}`);
  }
};

exports.checkOtpExpiry = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentTime = moment();
    const user = await User.findOne({userId});
    console.log("🚀 ~ file: user.controller.js:148 ~ exports.checkOtpExpiry= ~ user:", user.otp_expiry_time)
    res.status(200).json({data:user})
  } catch (err) {
    res.status(500).json(`Internal Server Error ${err}`);
  }
};

