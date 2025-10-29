const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const authorizeAdmin = require("../middleware/authAdmin");
const { list, create, buy } = require("../controllers/productController");

const {
  productsListLimiter,
  productCreateLimiter,
  productBuyLimiter,
} = require("../middleware/rateLimiters");

// public list
router.get("/", productsListLimiter, authenticate(false), list);

// admin create
router.post("/", productCreateLimiter, authenticate(), authorizeAdmin, create);

// user buy
router.post("/:id/buy", productBuyLimiter, authenticate(), buy);

module.exports = router;
