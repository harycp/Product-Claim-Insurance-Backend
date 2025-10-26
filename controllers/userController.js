const userService = require("../services/userService");

const getMe = async (req, res) => {
  try {
    const me = await userService.getUserById(req.user.id);
    if (!me) return res.status(404).json({ message: "User not found" });
    return res.json(me);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateMe = async (req, res) => {
  try {
    const { name, email } = req.body || {};
    const updated = await userService.updateUserById(req.user.id, {
      name,
      email,
    });
    if (!updated) return res.status(404).json({ message: "User not found" });

    return res.json({
      id: updated.id,
      email: updated.email,
      name: updated.name,
      is_admin: updated.is_admin,
      updatedAt: updated.updatedAt,
    });
  } catch (err) {
    return res
      .status(400)
      .json({ message: err?.errors?.[0]?.message || "Bad Request" });
  }
};

const listUsers = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || "10", 10), 50);
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const sortBy = req.query.sortBy || "createdAt";
    const order = (req.query.order || "DESC").toUpperCase();

    const result = await userService.listUsers({ limit, page, sortBy, order });
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const createUser = async (req, res) => {
  try {
    const {
      email,
      name,
      password = "Temp@12345",
      is_admin = false,
    } = req.body || {};
    if (!email || !name)
      return res.status(400).json({ message: "name and email are required" });

    const user = await userService.createUser({
      email,
      name,
      password,
      is_admin,
    });
    return res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name,
      is_admin: user.is_admin,
      createdAt: user.createdAt,
    });
  } catch (err) {
    return res
      .status(400)
      .json({ message: err?.errors?.[0]?.message || "Bad Request" });
  }
};

const updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, is_admin } = req.body || {};
    const updated = await userService.updateUserByAdmin(id, {
      name,
      email,
      is_admin,
    });
    if (!updated) return res.status(404).json({ message: "User not found" });

    return res.json({
      id: updated.id,
      email: updated.email,
      name: updated.name,
      is_admin: updated.is_admin,
      updatedAt: updated.updatedAt,
    });
  } catch (err) {
    return res
      .status(400)
      .json({ message: err?.errors?.[0]?.message || "Bad Request" });
  }
};

const deleteUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const ok = await userService.deleteUser(id);
    if (!ok) return res.status(404).json({ message: "User not found" });
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getMe,
  updateMe,
  listUsers,
  createUser,
  updateUserByAdmin,
  deleteUserByAdmin,
};
