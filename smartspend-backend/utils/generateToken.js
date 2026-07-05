const JWT = require("jsonwebtoken");

const generateToken = (userId) => {
  return JWT.sign({ _id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

module.exports = generateToken;
