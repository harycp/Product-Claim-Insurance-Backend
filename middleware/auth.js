const { verifyToken } = require("../utils/jwt");

const authenticate = (required = true) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"] || "";
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;

      if (!token) {
        if (!required) return next();
        return res
          .status(401)
          .json({ message: "Unauthorized: No token provided" });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }

      req.user = decoded;
      next();
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

module.exports = authenticate;
