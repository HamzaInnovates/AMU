const jwt = require("jsonwebtoken");
const { verifyToken, getUser } = require("../service/auth");

function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided." });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: "Unauthorized - Invalid token." });
  }

  const user = getUser(token);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized - User not found." });
  }

  req.user = user;
  next();
}

module.exports = {
  authenticateToken,
};
