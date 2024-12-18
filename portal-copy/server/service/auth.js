const jwt = require("jsonwebtoken");

const userTokenMap = new Map();

function setUser(token, user) {
  userTokenMap.set(token, user);
}

function getUser(token) {
  return userTokenMap.get(token);
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    return decoded;
  } catch (error) {
    return null;
  }
}

module.exports = {
  setUser,
  getUser,
  verifyToken,
};
