const mongoose = require("mongoose");
const bcrypt=require("bcrypt");
const User = new mongoose.Schema({
  image: {
    type: String,
    required: false,
      },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  otp: {
    type: String,
  },
  otp_expiry_time: {
    type: Date,
  },
});

User.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const user = mongoose.model("User", User);
module.exports = user;
