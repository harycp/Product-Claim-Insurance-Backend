const productService = require("../services/productService");

const list = async (req, res) => {
  try {
    const result = await productService.listProducts();
    return res.json({
      status: 200,
      message: "Products found",
      data: result,
    });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const create = async (req, res) => {
  try {
    const result = await productService.createProduct(req.body);
    if (result.error) return res.status(400).json({ message: result.error });
    return res.json({
      status: 201,
      message: "Product created successfully",
      data: result,
    });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const buy = async (req, res) => {
  try {
    const result = await productService.buyProduct({
      userId: req.user.id,
      productId: req.params.id,
    });
    if (result.error) return res.status(404).json({ message: result.error });
    return res.json({
      status: 200,
      message: "Product bought successfully",
      data: result,
    });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { list, create, buy };
