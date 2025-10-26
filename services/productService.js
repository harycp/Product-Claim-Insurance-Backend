const { Product, UserProduct } = require("../models");

const listProducts = async () => {
  const data = await Product.findAll({ order: [["createdAt", "DESC"]] });
  return data;
};

const createProduct = async ({
  name,
  description,
  premium_amount = 0,
  max_claim_amount = 0,
}) => {
  const product = await Product.create({
    name,
    description,
    premium_amount,
    max_claim_amount,
  });
  return product;
};

const buyProduct = async ({ userId, productId }) => {
  const product = await Product.findByPk(productId);
  if (!product) return { error: "Product not found" };

  const up = await UserProduct.create({
    user_id: userId,
    product_id: productId,
    status: "active",
    purchased_at: new Date(),
  });

  return { userProduct: up };
};

module.exports = { listProducts, createProduct, buyProduct };
