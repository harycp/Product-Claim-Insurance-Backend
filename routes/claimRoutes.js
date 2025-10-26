const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const authorizeAdmin = require("../middleware/authorizeAdmin");
const {
  list,
  create,
  updateStatus,
} = require("../controllers/claimController");

const {
  claimsListLimiter,
  claimCreateLimiter,
  claimStatusLimiter,
  claimByCodeLimiter,
} = require("../middleware/rateLimitersMemory");

router.get("/", claimsListLimiter, authenticate(), list);

router.post("/", claimCreateLimiter, authenticate(), create);

router.patch(
  "/:id/status",
  claimStatusLimiter,
  authenticate(),
  authorizeAdmin,
  updateStatus
);

module.exports = router;
