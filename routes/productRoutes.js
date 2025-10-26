const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const authorizeAdmin = require("../middleware/authorizeAdmin");
const { list, create, buy } = require("../controllers/productController");

// public list
router.get("/", authenticate(false), list);

// admin create
router.post("/", authenticate(), authorizeAdmin, create);

// user buy
router.post("/:id/buy", authenticate(), buy);

module.exports = router;
