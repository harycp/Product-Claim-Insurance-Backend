const claimService = require("../services/claimService");

const list = async (req, res) => {
  try {
    const claims = await claimService.listClaims(req.user);
    return res.json(claims);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const create = async (req, res) => {
  try {
    const { product_id, reason, amount } = req.body;
    const result = await claimService.createClaim({
      user: req.user,
      product_id,
      reason,
      amount,
    });

    if (result.error) return res.status(400).json({ message: result.error });
    return res.status(201).json(result);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateStatus = async (req, res) => {
  try {
    const claimId = req.params.id;
    const { status } = req.body;

    const result = await claimService.updateClaimStatus({ claimId, status });
    if (result.error) return res.status(400).json({ message: result.error });

    return res.json(result);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { list, create, updateStatus };
