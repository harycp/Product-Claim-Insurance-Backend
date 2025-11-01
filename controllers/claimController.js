const claimService = require("../services/claimService");

const list = async (req, res) => {
  try {
    const claims = await claimService.listClaims(req.user);
    return res.json({
      status: 200,
      message: "Claims found",
      data: claims,
    });
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
    return res.json({
      status: 201,
      message: "Claim created",
      data: success,
    });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateStatus = async (req, res) => {
  try {
    const claimCode = req.params.code;
    const { status } = req.body;

    const result = await claimService.updateClaimStatus({ claimCode, status });
    if (result.error) return res.status(400).json({ message: result.error });

    return res.json({
      status: 200,
      message: "Claim status updated",
      data: result,
    });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getByCode = async (req, res) => {
  try {
    const code = req.params.code;
    const result = await claimService.getClaimByCode(code);

    const isAdmin = !!req.user?.is_admin;
    const isOwner =
      result?.no_policy && req.user?.no_policy === result.no_policy;
    if (!isAdmin && !isOwner)
      return res.status(403).json({ message: "Forbidden" });

    return res.json({
      status: 200,
      message: "Claim found",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { list, create, updateStatus, getByCode };
