// middleware/rateLimitersMemory.js
const rateLimit = require("express-rate-limit");

// util ip -> string aman jadi key
const ipKey = (req) => {
  let ip =
    (req.headers["x-forwarded-for"] || "")
      .toString()
      .split(",")
      .shift()
      .trim() ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip ||
    "unknown";
  if (ip === "::1" || ip === "1") ip = "127.0.0.1";
  return (ip === "::1" ? "127.0.0.1" : ip).replace(/[:.]/g, "_");
};

// factory: limiter per-IP (public endpoints)
const createIpLimiter = (options) =>
  rateLimit({
    keyGenerator: (req) => {
      const action = options.action || "default";
      return `${action}_ip_${ipKey(req)}`;
    },
    standardHeaders: true,
    legacyHeaders: false,
    ...options, // windowMs, max, message, etc.
  });

// factory: limiter per-User (butuh authenticate; fallback ke IP)
const createUserLimiter = (options) =>
  rateLimit({
    keyGenerator: (req) => {
      const action = options.action || "default";
      if (req.user?.id) return `${action}_user_${req.user.id}`;
      return `${action}_ip_${ipKey(req)}`;
    },
    standardHeaders: true,
    legacyHeaders: false,
    ...options,
  });

/* ===== PRESETS (angka sama seperti versi Redis) ===== */

// AUTH
const loginLimiter = createIpLimiter({
  windowMs: 10 * 60 * 1000,
  max: 5,
  action: "login",
  message: { message: "Too many login attempts. Try again in 10 minutes." },
});

// PRODUCTS
const productsListLimiter = createIpLimiter({
  windowMs: 60 * 1000,
  max: 300,
  action: "products_list",
});
const productCreateLimiter = createUserLimiter({
  windowMs: 60 * 1000,
  max: 30,
  action: "product_create",
});
const productBuyLimiter = createUserLimiter({
  windowMs: 60 * 1000,
  max: 20,
  action: "product_buy",
});

// CLAIMS
const claimsListLimiter = createUserLimiter({
  windowMs: 60 * 1000,
  max: 120,
  action: "claims_list",
});
const claimCreateLimiter = createUserLimiter({
  windowMs: 60 * 1000,
  max: 30,
  action: "claim_create",
});
const claimStatusLimiter = createUserLimiter({
  windowMs: 60 * 1000,
  max: 60,
  action: "claim_status",
});
const claimByCodeLimiter = createUserLimiter({
  windowMs: 60 * 1000,
  max: 60,
  action: "claim_by_code",
});

// USERS
const usersMeLimiter = createUserLimiter({
  windowMs: 60 * 1000,
  max: 120,
  action: "users_me",
});
const usersAdminListLimiter = createUserLimiter({
  windowMs: 60 * 1000,
  max: 120,
  action: "users_admin_list",
});
const usersAdminCreateLimiter = createUserLimiter({
  windowMs: 60 * 1000,
  max: 60,
  action: "users_admin_create",
});

module.exports = {
  // factories
  createIpLimiter,
  createUserLimiter,
  // presets
  loginLimiter,
  productsListLimiter,
  productCreateLimiter,
  productBuyLimiter,
  claimsListLimiter,
  claimCreateLimiter,
  claimStatusLimiter,
  claimByCodeLimiter,
  usersMeLimiter,
  usersAdminListLimiter,
  usersAdminCreateLimiter,
};
