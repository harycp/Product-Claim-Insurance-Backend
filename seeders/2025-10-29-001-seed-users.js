"use strict";

const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const passwordHash = await bcrypt.hash("c", 10);

    const users = [
      {
        id: uuidv4(),
        name: "Admin Prudential",
        email: "admin@prudential.com",
        password: await bcrypt.hash("admin123", 10),
        is_admin: true,
        no_policy: "POL-ADMIN-000",
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
      {
        id: uuidv4(),
        name: "Hary Capri",
        email: "hary.capri@example.com",
        password: passwordHash,
        is_admin: false,
        no_policy: "POL-000123",
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
      {
        id: uuidv4(),
        name: "Demo User",
        email: "demo.user@example.com",
        password: passwordHash,
        is_admin: false,
        no_policy: "POL-000456",
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
    ];

    await queryInterface.bulkInsert("Users", users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
