const express = require("express");
const { handleUserSignup, handleUserLogin,  handleDeleteEmployees} = require("../controllers/user");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

// ROUTES
router.post("/signup", handleUserSignup);
router.post("/login", handleUserLogin);
router.post("/deleteEmployees/:userId", authMiddleware.authenticateToken, handleDeleteEmployees);
module.exports = router;
