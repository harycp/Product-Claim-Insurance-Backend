const sequelize = require("../config/database");
const User = require("./User");
const Product = require("./Product");
const Claim = require("./Claim");

User.hasMany(Claim, { foreignKey: "user_id" });
Claim.belongsTo(User, { foreignKey: "user_id" });

Product.hasMany(Claim, { foreignKey: "product_id" });
Claim.belongsTo(Product, { foreignKey: "product_id" });

const db = {
  sequelize,
  User,
  Product,
  Claim,
};

module.exports = db;
