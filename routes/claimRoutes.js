const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const authorizeAdmin = require("../middleware/authorizeAdmin");
const {
  list,
  create,
  updateStatus,
} = require("../controllers/claimController");

router.get("/", authenticate(), list);

router.post("/", authenticate(), create);

router.patch("/:id/status", authenticate(), authorizeAdmin, updateStatus);

module.exports = router;
