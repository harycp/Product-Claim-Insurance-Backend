"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `CREATE EXTENSION IF NOT EXISTS "pgcrypto";`
    );
    await queryInterface.changeColumn("UserProducts", "id", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.literal("gen_random_uuid()"),
      primaryKey: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("UserProducts", "id", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
    });
  },
};
