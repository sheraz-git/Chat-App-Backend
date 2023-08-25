const jwt = require("jsonwebtoken");
require("dotenv").config();
const SecretKey = process.env.SECRET_KEY;

const sign = (payload) => {
  return jwt.sign(payload, SecretKey);
};

const authenticate = async (req, res, next) => {
  try {
    let token;
    // Extract token from cookies
    const tokenFromCookies = req.cookies.token;
    if (tokenFromCookies) {
      token = tokenFromCookies;
    } 
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
    if (!token) {
      return res.status(404).json({
        message: "Token not found",
      });
    }
    const decoded = jwt.verify(token, SecretKey);
    next();
  } catch (error) {
    console.log("error", error);
    return res.status(409).json({
      message: "Invalid token",
    });
  }
};

module.exports = {
  sign,
  authenticate,
};