const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserProduct = sequelize.define(
  "UserProduct",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    no_policy: { type: DataTypes.STRING, allowNull: false },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
      allowNull: false,
    },
    purchased_at: {
      type: DataTypes.DATE,
      paranoid: true,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  { timestamps: true }
);

module.exports = UserProduct;
