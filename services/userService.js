const { User } = require("../models");

const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: ["id", "email", "name", "is_admin", "created_at", "updated_at"],
  });

  return user;
};

const updateUserById = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) return null;

  const { name, email } = data;
  if (typeof name === "string") user.name = name.trim();
  if (typeof email === "string") user.email = email.trim();

  await user.save();
  return user;
};

const listUsers = async ({
  limit = 10,
  page = 1,
  sortBy = "createdAt",
  order = "DESC",
}) => {
  const offset = (page - 1) * limit;
  const validSort = ["createdAt", "name", "email"].includes(sortBy)
    ? sortBy
    : "createdAt";
  const validOrder = order.toUpperCase() === "ASC" ? "ASC" : "DESC";

  const { rows, count } = await User.findAndCountAll({
    attributes: ["id", "email", "name", "is_admin", "createdAt"],
    limit,
    offset,
    order: [[validSort, validOrder]],
  });

  return {
    data: rows,
    meta: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
      sortBy: validSort,
      order: validOrder,
    },
  };
};

const createUser = async ({
  email,
  name,
  password = "Temp@12345",
  is_admin = false,
}) => {
  const user = await User.create({ email, name, password, is_admin });
  return user;
};

// update user lain (admin)
const updateUserByAdmin = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) return null;

  const { name, email, is_admin } = data;
  if (typeof name === "string") user.name = name.trim();
  if (typeof email === "string") user.email = email.trim();
  if (typeof is_admin === "boolean") user.is_admin = is_admin;

  await user.save();
  return user;
};

// hapus user (admin, soft delete)
const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  await user.destroy();
  return true;
};

module.exports = {
  getUserById,
  updateUserById,
  listUsers,
  createUser,
  updateUserByAdmin,
  deleteUser,
};
