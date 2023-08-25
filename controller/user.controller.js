const User = require("../model/user.model");
const { sign } = require("../middleware/Authentication");
exports.signUp = async (req, res) => {
  console.log("req.body", req.body);
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      console.log("Error (User Already Exists)");
      return res.status(409).json({ message: "User Already Exists" });
    }
    const newUser = await User.create(req.body);
    await newUser.save();
    const token = await sign({ userId: newUser.id });
    res.cookie("token", token, {
      maxAge: 2592000, // 30 days
    });
    res.status(200).json({ data: newUser,token });
  } catch (err) {
    console.log("err", err);
    res.status(500).json(`Internal Server Error ${err}`);
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }
    const token = await sign({ userId: user.id });
    // Set the token as a cookie
    res.cookie("token", token, {
      maxAge: 30 * 60 * 1000, // 30 minutes in milliseconds
    });
    res.status(200).json({ success: true, data: user, token });
  } catch (err) {
    console.log("err", err);
    res.status(500).json(`Internal Server Error ${err}`);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    user
      ? res.status(200).json({ data: user })
      : res.status(404).json("UserNotFound");
  } catch (err) {
    console.log("err", err);
    res.status(500).json(`Internal Server Error ${err}`);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ data: users });
  } catch (err) {
    console.error("Error in getting users:", err);
    res.status(500).json({ error: `Internal Server Error: ${err}` });
  }
};

exports.updateUserInfo = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (user) {
      user.set(req.body);
      const updatedUser = await user.save();
      res.status(200).json({ data: updatedUser });
    } else {
      res.status(404).json("UserNotFound");
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).json(`Internal Server Error ${err}`);
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (user) {
      await User.findByIdAndDelete(user);
      res.status(200).json({ data: "UserDeleted" });
    } else {
      res.status(404).json("UserNotFound");
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).json(`Internal Server Error ${err}`);
  }
};
