const { Product, UserProduct, User } = require("../models");

const listProducts = async () => {
  const products = await Product.findAll({
    order: [["createdAt", "DESC"]],
  });
  return products;
};

const createProduct = async ({
  name,
  description,
  premium_amount,
  max_claim_amount,
}) => {
  if (!name || !description)
    return { error: "name and description are required" };

  const product = await Product.create({
    name,
    description,
    premium_amount: premium_amount || 0,
    max_claim_amount: max_claim_amount || 0,
  });

  return product;
};

const buyProduct = async ({ userId, productId }) => {
  const [user, product] = await Promise.all([
    User.findByPk(userId),
    Product.findByPk(productId),
  ]);

  if (!user) return { error: "User not found" };
  if (!product) return { error: "Product not found" };

  const ownership = await UserProduct.create({
    user_id: user.id,
    product_id: product.id,
    no_policy: user.no_policy,
    status: "active",
    purchased_at: new Date(),
  });

  return { message: "Product purchased successfully", ownership };
};

module.exports = { listProducts, createProduct, buyProduct };
