const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    premium_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0,
    },
    max_claim_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0,
    },
  },
  { timestamps: true }
);

module.exports = Product;