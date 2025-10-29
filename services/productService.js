const { Product, UserProduct, User } = require("../models");
const cache = require("./cacheService");

const PRODUCTS_LIST_KEY = "products:list";
const PRODUCTS_TTL = parseInt(process.env.REDIS_TTL_PRODUCTS || "120", 10);

const listProducts = async () => {
  const cached = await cache.get(PRODUCTS_LIST_KEY);
  if (cached) return { fromCache: true, data: cached };

  const products = await Product.findAll({ order: [["createdAt", "DESC"]] });

  await cache.set(PRODUCTS_LIST_KEY, products, PRODUCTS_TTL);

  return { fromCache: false, data: products };
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

  await cache.del(PRODUCTS_LIST_KEY);

  return product;
};

const buyProduct = async ({ userId, productId }) => {
  const [user, product] = await Promise.all([
    User.findByPk(userId),
    Product.findByPk(productId),
  ]);

  if (!user) return { error: "User not found" };
  if (!product) return { error: "Product not found" };

  // jika user sudah punya product itu, maka error juga
  const alreadyOwns = await UserProduct.findOne({
    where: { user_id: user.id, product_id: product.id, status: "active" },
  });
  if (alreadyOwns) return { error: "User already owns this product" };

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
