const bcrypt = require("bcryptjs");
const { User, Product, Claim } = require("../models");
const { generateToken } = require("../utils/jwt");

const login = async ({ email, password }) => {
  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return { error: "User not found" };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return { error: "Invalid credentials" };
  }

  const token = generateToken(user);
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      no_policy: user.no_policy,
      is_admin: user.is_admin,
    },
  };
};

const getUserWithRelationsById = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ["id", "no_policy", "email", "name", "is_admin"],
    include: [
      {
        model: Product,
        as: "Products",
        attributes: [
          "id",
          "name",
          "description",
          "premium_amount",
          "max_claim_amount",
        ],
        through: { attributes: ["status", "purchased_at"] },
      },
      {
        model: Claim,
        attributes: [
          "id",
          "reason",
          "amount",
          "status",
          "product_id",
          "no_policy",
          "createdAt",
        ],
        include: [
          { model: Product, attributes: ["id", "name", "max_claim_amount"] },
        ],
      },
    ],
  });
  if (!user) return null;

  const products = (user.Products || []).map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    premium_amount: p.premium_amount,
    max_claim_amount: p.max_claim_amount,
    ownership: {
      status: p.UserProduct.status,
      purchased_at: p.UserProduct.purchased_at,
    },
  }));

  const claims = (user.Claims || []).map((c) => ({
    id: c.id,
    reason: c.reason,
    amount: c.amount,
    status: c.status,
    no_policy: c.no_policy,
    product: c.Product
      ? {
          id: c.Product.id,
          name: c.Product.name,
          max_claim_amount: c.Product.max_claim_amount,
        }
      : null,
    createdAt: c.createdAt,
  }));

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    no_policy: user.no_policy,
    is_admin: user.is_admin,
    products,
    claims,
  };
};

const getUserWithNoPolicy = async (noPolicy) => {
  const user = await User.findOne({
    where: { no_policy: noPolicy },
    attributes: ["id", "no_policy", "email", "name", "is_admin"],
    include: [
      {
        model: Product,
        as: "Products",
        attributes: [
          "id",
          "name",
          "description",
          "premium_amount",
          "max_claim_amount",
        ],
        through: { attributes: ["status", "purchased_at"] },
      },
      {
        model: Claim,
        attributes: [
          "id",
          "reason",
          "amount",
          "status",
          "product_id",
          "no_policy",
          "createdAt",
        ],
        include: [
          { model: Product, attributes: ["id", "name", "max_claim_amount"] },
        ],
      },
    ],
  });

  if (!user) return null;

  const products = (user.Products || []).map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    premium_amount: p.premium_amount,
    max_claim_amount: p.max_claim_amount,
    ownership: {
      status: p.UserProduct.status,
      purchased_at: p.UserProduct.purchased_at,
    },
  }));

  const claims = (user.Claims || []).map((c) => ({
    id: c.id,
    reason: c.reason,
    amount: c.amount,
    status: c.status,
    no_policy: c.no_policy,
    product: c.Product
      ? {
          id: c.Product.id,
          name: c.Product.name,
          max_claim_amount: c.Product.max_claim_amount,
        }
      : null,
    createdAt: c.createdAt,
  }));

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    no_policy: user.no_policy,
    is_admin: user.is_admin,
    products,
    claims,
  };
};

const createUser = async ({
  email,
  name,
  password,
  is_admin = false,
  no_policy,
}) => {
  if (!email || !name || !password || !no_policy)
    return { error: "email, name, password, and no_policy are required" };

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    name,
    password: hashed,
    is_admin,
    no_policy,
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    no_policy: user.no_policy,
    is_admin: user.is_admin,
  };
};

const listUsers = async () => {
  const users = await User.findAll({
    attributes: ["id", "no_policy", "email", "name", "is_admin", "createdAt"],
  });
  return users;
};

module.exports = {
  login,
  getUserWithRelationsById,
  getUserWithNoPolicy,
  createUser,
  listUsers,
};
