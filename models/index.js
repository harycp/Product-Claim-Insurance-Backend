const sequelize = require("../config/database");
const User = require("./User");
const Product = require("./Product");
const Claim = require("./Claim");
const UserProduct = require("./UserProduct");

User.hasMany(Claim, { foreignKey: "user_id" });
Claim.belongsTo(User, { foreignKey: "user_id" });

Product.hasMany(Claim, { foreignKey: "product_id" });
Claim.belongsTo(Product, { foreignKey: "product_id" });

User.belongsToMany(Product, {
  through: UserProduct,
  foreignKey: "user_id",
  otherKey: "product_id",
  as: "Products",
});

Product.belongsToMany(User, {
  through: UserProduct,
  foreignKey: "product_id",
  otherKey: "user_id",
  as: "Users",
});

const db = {
  sequelize,
  User,
  Product,
  Claim,
  UserProduct,
};

module.exports = db;
