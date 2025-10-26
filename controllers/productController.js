const productService = require("../services/productService");

const list = async (req, res) => {
  try {
    const products = await productService.listProducts();
    return res.json(products);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const create = async (req, res) => {
  try {
    const { name, description, premium_amount, max_claim_amount } =
      req.body || {};
    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "name and description are required" });
    }

    const product = await productService.createProduct({
      name,
      description,
      premium_amount,
      max_claim_amount,
    });

    return res.status(201).json(product);
  } catch (err) {
    return res
      .status(400)
      .json({ message: err?.errors?.[0]?.message || "Bad Request" });
  }
};

const buy = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;

    const { error, userProduct } = await productService.buyProduct({
      userId,
      productId,
    });
    if (error) return res.status(404).json({ message: error });

    return res
      .status(201)
      .json({ message: "Product purchased", user_product_id: userProduct.id });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { list, create, buy };
