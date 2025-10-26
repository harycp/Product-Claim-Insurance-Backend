function authorizeAdmin(req, res, next) {
  if (!req.user?.is_admin) {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
}

module.exports = authorizeAdmin;
