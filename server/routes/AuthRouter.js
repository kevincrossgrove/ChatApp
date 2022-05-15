const router = require("express").Router();
const AuthController = require("../controllers/AuthController");

// Create Account
router.post("/", AuthController.createAccount);

// Login Account
router.post("/login", AuthController.login);

// Logout Account
router.post("/logout", AuthController.logout);

// Get User
router.get("/user", AuthController.getUser);

module.exports = router;
