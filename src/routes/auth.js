const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Auth routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

// Example protected route
router.get("/me", authMiddleware, (req, res) => {
  res.json({ success: true, message: "You are authenticated", user: req.user });
});

// Healthcheck route
router.get("/healthcheck", (req, res) => {
  res.status(200).json({ status: "UP", timestamp: new Date().toISOString() });
});

module.exports = router;
