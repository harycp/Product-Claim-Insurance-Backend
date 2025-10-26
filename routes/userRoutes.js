const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const authorizeAdmin = require("../middleware/authAdmin");

const {
  getMe,
  updateMe,
  listUsers,
  createUser,
  updateUserByAdmin,
  deleteUserByAdmin,
} = require("../controllers/userController");

router.get("/me", authenticate(), getMe);
router.patch("/me", authenticate(), updateMe);

router.get("/", authenticate(), authorizeAdmin, listUsers);
router.post("/", authenticate(), authorizeAdmin, createUser);
router.patch("/:id", authenticate(), authorizeAdmin, updateUserByAdmin);
router.delete("/:id", authenticate(), authorizeAdmin, deleteUserByAdmin);

module.exports = router;
