const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const authorizeAdmin = require("../middleware/authAdmin");

const {
  login,
  getMe,
  listUsers,
  getUserByPolicy,
  createUser,
} = require("../controllers/userController");

router.post("/login", login);

// user
router.get("/me", authenticate(), getMe);

// admin only
router.get("/", authenticate(), authorizeAdmin, listUsers);
router.post("/", authenticate(), authorizeAdmin, createUser);
router.get(
  "/policy/:no_policy",
  authenticate(),
  authorizeAdmin,
  getUserByPolicy
);

module.exports = router;
