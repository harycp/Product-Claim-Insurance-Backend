const crypto = require("crypto");
const { Claim, User, Product } = require("../models");

const cache = require("./cacheService");

const CLAIMS_USER_TTL = parseInt(process.env.REDIS_TTL_CLAIMS_USER || "30", 10);
const CLAIM_BY_CODE_TTL = parseInt(
  process.env.REDIS_TTL_CLAIM_CODE || "60",
  10
);

const userClaimsKey = (noPolicy) => `claims:list:user:${noPolicy}`;
const claimByCodeKey = (code) => `claim:code:${code}`;

const generateClaimCode = async () => {
  const raw = crypto.randomBytes(6).toString("hex").toUpperCase();
  return `CLM-${raw}`;
};

const listClaims = async (user) => {
  if (user.is_admin) {
    const claims = await Claim.findAll({
      include: [
        { model: Product, attributes: ["id", "name", "max_claim_amount"] },
        { model: User, attributes: ["id", "name", "email", "no_policy"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    return claims;
  }

  const key = userClaimsKey(user.no_policy);
  const cached = await cache.get(key);
  if (cached) return { fromCache: true, data: cached };

  const claims = await Claim.findAll({
    where: { no_policy: user.no_policy },
    include: [
      { model: Product, attributes: ["id", "name", "max_claim_amount"] },
      { model: User, attributes: ["id", "name", "email", "no_policy"] },
    ],
    order: [["createdAt", "DESC"]],
  });

  await cache.set(key, claims, CLAIMS_USER_TTL);
  return { fromCache: false, data: claims };
};

const createClaim = async ({ user, product_id, reason, amount }) => {
  if (!reason || !amount) return { error: "reason and amount are required" };

  const product = await Product.findByPk(product_id);
  if (!product) return { error: "Product not found" };

  if (parseFloat(amount) > parseFloat(product.max_claim_amount)) {
    return { error: "Claim amount exceeds maximum limit" };
  }

  let claim_code;
  for (let i = 0; i < 3; i++) {
    const code = await generateClaimCode();
    const exists = await Claim.findOne({ where: { claim_code: code } });
    if (!exists) {
      claim_code = code;
      break;
    }
  }
  if (!claim_code) return { error: "Failed to generate claim code" };

  const claim = await Claim.create({
    claim_code,
    user_id: user.id,
    product_id,
    no_policy: user.no_policy,
    reason,
    amount,
    status: "pending",
  });

  // invalidasi cache user & stats (jika dipakai)
  await cache.del(userClaimsKey(user.no_policy));
  await cache.del(CLAIMS_STATS_KEY); // aman walau belum kamu pakai

  // simpan juga cache per-claim-by-code
  await cache.set(claimByCodeKey(claim.claim_code), claim, CLAIM_BY_CODE_TTL);

  return claim;
};

const updateClaimStatus = async ({ claimId, status }) => {
  const validStatuses = ["approved", "rejected"];
  if (!validStatuses.includes(status)) return { error: "Invalid status" };

  const claim = await Claim.findByPk(claimId);
  if (!claim) return { error: "Claim not found" };

  claim.status = status;
  await claim.save();

  // invalidate caches
  if (claim.no_policy) await cache.del(userClaimsKey(claim.no_policy));
  if (claim.claim_code) await cache.del(claimByCodeKey(claim.claim_code));
  await cache.del(CLAIMS_STATS_KEY);

  return claim;
};

const getClaimByCode = async ({ code }) => {
  const key = claimByCodeKey(code);
  const cached = await cache.get(key);
  if (cached) return { fromCache: true, data: cached };

  const claim = await Claim.findOne({
    where: { claim_code: code },
    include: [
      { model: Product, attributes: ["id", "name", "max_claim_amount"] },
      { model: User, attributes: ["id", "name", "email", "no_policy"] },
    ],
  });
  if (!claim) return { error: "Claim not found" };

  await cache.set(key, claim, CLAIM_BY_CODE_TTL);
  return { fromCache: false, data: claim };
};

module.exports = { listClaims, createClaim, updateClaimStatus, getClaimByCode };
