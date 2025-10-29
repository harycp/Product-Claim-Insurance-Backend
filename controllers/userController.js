const userService = require("../services/userService");

const login = async (req, res) => {
  try {
    const result = await userService.login(req.body);
    if (result.error) {
      const status =
        result.error === "User not found"
          ? 404
          : result.error === "Invalid credentials"
          ? 401
          : 400;
      return res.status(status).json({ message: result.error });
    }

    return res.json({
      message: "Login successful",
      token: result.token,
      user: result.user,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getMe = async (req, res) => {
  try {
    const data = await userService.getUserWithRelationsById(req.user.id);
    if (!data) return res.status(404).json({ message: "User not found" });
    return res.json(data);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserByPolicy = async (req, res) => {
  try {
    const { no_policy } = req.params;
    const data = await userService.getUserWithNoPolicy(no_policy);
    if (!data) return res.status(404).json({ message: "User not found" });
    return res.json(data);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const createUser = async (req, res) => {
  try {
    const result = await userService.createUser(req.body);
    if (result.error) return res.status(400).json({ message: result.error });
    return res.status(201).json(result);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const listUsers = async (req, res) => {
  try {
    const data = await userService.listUsers();
    return res.json(data);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  login,
  getMe,
  getUserByPolicy,
  createUser,
  listUsers,
};
