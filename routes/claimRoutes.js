const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const authorizeAdmin = require("../middleware/authAdmin");
const {
  list,
  create,
  updateStatus,
  getByCode,
} = require("../controllers/claimController");
const {
  claimsListLimiter,
  claimCreateLimiter,
  claimStatusLimiter,
  claimByCodeLimiter,
} = require("../middleware/rateLimiters");

router.get("/", claimsListLimiter, authenticate(), list);

router.post("/", claimCreateLimiter, authenticate(), create);

router.put(
  "/:code/status",
  claimStatusLimiter,
  authenticate(),
  authorizeAdmin,
  updateStatus
);

router.get("/code/:code", claimStatusLimiter, authenticate(), getByCode);

module.exports = router;
