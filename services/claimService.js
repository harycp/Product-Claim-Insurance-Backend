const { Claim, User, Product } = require("../models");

const listClaims = async (user) => {
  const where = user.is_admin ? {} : { no_policy: user.no_policy };

  const claims = await Claim.findAll({
    where,
    include: [
      {
        model: Product,
        attributes: ["id", "name", "max_claim_amount"],
      },
      {
        model: User,
        attributes: ["id", "name", "email", "no_policy"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return claims;
};

const createClaim = async ({ user, product_id, reason, amount }) => {
  if (!reason || !amount) return { error: "reason and amount are required" };

  const product = await Product.findByPk(product_id);
  if (!product) return { error: "Product not found" };

  if (parseFloat(amount) > parseFloat(product.max_claim_amount)) {
    return { error: "Claim amount exceeds maximum limit" };
  }

  const claim = await Claim.create({
    user_id: user.id,
    product_id,
    no_policy: user.no_policy,
    reason,
    amount,
    status: "pending",
  });

  return claim;
};

const updateClaimStatus = async ({ claimCode, status }) => {
  const validStatuses = ["approved", "rejected"];
  if (!validStatuses.includes(status)) return { error: "Invalid status" };

  const claim = await Claim.findByPk(claimCode);
  if (!claim) return { error: "Claim not found" };

  claim.status = status;
  await claim.save();

  return claim;
};

const getClaimByCode = async ({ code }) => {
  const claim = Claim.findOne({
    where: { claim_code: code },
    include: [
      {
        model: Product,
        attributes: ["id", "name", "max_claim_amount"],
      },
      {
        model: User,
        attributes: ["id", "name", "email", "no_policy"],
      },
    ],
  });

  if (!claim) return { error: "Claim not found" };

  return claim;
};

module.exports = { listClaims, createClaim, updateClaimStatus, getClaimByCode };
