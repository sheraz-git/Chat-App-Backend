const User = require("../model/user.model");
const { success, error, validation } = require("../helper/response");
const { sign } = require("../middleware/Authentication");

exports.signUp = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return error("Email and Password already exist", "CONFLICT", res);
    }
    const newUser = await User.create(req.body);
    await newUser.save();
    const token = await sign({ userId: newUser.id });
    res.cookie("token", token, {
      maxAge: 2592000, // 30 days
    });
    success(
      "SignUp Created Successfully",
      { newUser, token },
      "CREATED",
      res
    );
  } catch (err) {
    error(err.message, "INTERNAL_SERVER_ERROR", res);
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return error("Invalid email or password", "UNAUTHORIZED", res);
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return error("Invalid password", "UNAUTHORIZED", res);
    }
    const token = await sign({ userId: user.id });
    res.cookie("token", token, {
      maxAge: 30 * 60 * 1000, // 30 minutes in milliseconds
    });
    success("User Login Successfully", { data: user, token }, "OK", res);
  } catch (err) {
    error(err.message, "INTERNAL_SERVER_ERROR", res);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    user
      ? success("User", { data: user }, "OK", res)
      : error("UserNotFound", "NOT_FOUND", res);
  } catch (err) {
    error(err.message, "INTERNAL_SERVER_ERROR", res);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    success("Users", { data: users }, "OK", res);
  } catch (err) {
    error(err.message, "INTERNAL_SERVER_ERROR", res);
  }
};
exports.updateUserInfo = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (user) {
      user.set(req.body);
      const updatedUser = await user.save();
      success("User", { data: updatedUser }, "OK", res);
    } else {
      error("UserNotFound", "NOT_FOUND", res);
    }
  } catch (err) {
    error(err.message, "INTERNAL_SERVER_ERROR", res);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (user) {
      await User.findByIdAndDelete(user);
      success("User-deleted", { data: user }, "OK", res);
    } else {
      error("UserNotFound", "NOT_FOUND", res);
    }
  } catch (err) {
    error(err.message, "INTERNAL_SERVER_ERROR", res);
  }
};
