const User = require("../model/user.model");
const moment = require("moment");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const { success, error, validation } = require("../helper/response");
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
    if (info) {
      return success("OTP Sent Successfully!", { data: user }, "CREATED", res);
    }
    return error("otp Already Send", "BAD_REQUEST", res);
  } catch (err) {
    error(err.message, "INTERNAL_SERVER_ERROR", res);
  }
};

exports.checkOtpVerify = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findOne({ otp });
    if (!user) {
      return error("Incorrect Otp", "BAD_REQUEST", res);
    }
    const currentTime = moment();
    const otpExpiryTime = moment(user.otp_expiry_time);
    if (currentTime.isAfter(otpExpiryTime)) {
      return error("Incorrect is Expired", "CONFLICT", res);
    }
    return success("Otp verified successfully", { data: user }, "OK", res);
  } catch (err) {
    error(err.message, "INTERNAL_SERVER_ERROR", res);
  }
};

exports.checkOtpExpiry = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentTime = moment();
    const user = await User.findOne({ userId });
    console.log(
      "🚀 ~ file: user.controller.js:148 ~ exports.checkOtpExpiry= ~ user:",
      user.otp_expiry_time
    );
    res.status(200).json({ data: user });
  } catch (err) {
    res.status(500).json(`Internal Server Error ${err}`);
  }
};


exports.forUserEmail = async function (req,res) {
  try {
    const {email}=req.body;
    const user=await User.findOne({email:email});

    // create reusable transporter object using the default SMTP transport
    let transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "Gmail",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "sherazabbas669@gmail.com",
        pass: "dyoonnvupsqlgzjy",
      },
    });

    let mailOptions = {
      to: user.email,
      subject: "New User Registration",
      html: `<h1>Hello</h1>
            <p>Registration Confirmation</p>
            <p>Name: ${user.name}</p>
            <p>Email: ${user.email}</p>
            <p>Please take necessary actions.</p>
            <p>Click the following link to see the user details:</p>
            <p><a href="http://localhost:3000/login">Move to Website</a></p>
            <h2>Thank and Regards</h2>
            <h2>ZNZ Communication</h2>`
   };
    
    // send email with defined transport object
    let info = await transport.sendMail(mailOptions);
    console.log("Email sent successfully");
    if(info){
      return success("EMAIL Sent Successfully!", { data: user }, "OK", res);
    }
  } catch (err) {
  
    error(err.message, "INTERNAL_SERVER_ERROR", res);
  }
};
