const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const authorizeAdmin = require("../middleware/authAdmin");
const {
  loginLimiter,
  usersMeLimiter,
  usersAdminCreateLimiter,
  usersAdminListLimiter,
} = require("../middleware/rateLimiters");

const {
  login,
  getMe,
  listUsers,
  getUserByPolicy,
  createUser,
} = require("../controllers/userController");

router.post("/login", loginLimiter, login);

// user
router.get("/me", usersMeLimiter, authenticate(), getMe);

// admin only
router.get(
  "/",
  usersAdminListLimiter,
  authenticate(),
  authorizeAdmin,
  listUsers
);
router.post(
  "/",
  usersAdminCreateLimiter,
  authenticate(),
  authorizeAdmin,
  createUser
);
router.get(
  "/policy/:no_policy",
  usersAdminListLimiter,
  authenticate(),
  authorizeAdmin,
  getUserByPolicy
);

module.exports = router;
