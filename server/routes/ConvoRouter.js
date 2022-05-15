const router = require("express").Router();
const AuthController = require("../controllers/AuthController");
const AuthMiddleware = require("../middleware/AuthMiddleware");

// Create Conversation
router.post("/", AuthMiddleware, AuthController.createAccount);

module.exports = router;
