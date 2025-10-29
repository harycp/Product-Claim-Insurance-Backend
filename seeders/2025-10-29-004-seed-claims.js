"use strict";

const crypto = require("crypto");

const genClaimCode = () =>
  `CLM-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const { sequelize } = queryInterface;

    const [[user]] = await sequelize.query(
      `SELECT id, no_policy FROM "Users" WHERE email = 'hary.capri@example.com' LIMIT 1;`
    );

    if (!user)
      throw new Error("Seed users first: hary.capri@example.com not found");

    const [[prodHosp]] = await sequelize.query(
      `SELECT id, name FROM "Products" WHERE name = 'PRUHospital & Surgical Cover Plus' LIMIT 1;`
    );
    const [[prodCrit]] = await sequelize.query(
      `SELECT id, name FROM "Products" WHERE name = 'PRUCritical Care 90' LIMIT 1;`
    );

    if (!prodHosp || !prodCrit)
      throw new Error("Seed products first: required products not found");

    const claims = [
      {
        id: crypto.randomUUID(),
        claim_code: genClaimCode(),
        reason: "Rawat inap karena demam berdarah",
        amount: 3500000,
        status: "approved",
        no_policy: user.no_policy,
        user_id: user.id,
        product_id: prodHosp.id,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: crypto.randomUUID(),
        claim_code: genClaimCode(),
        reason: "Diagnosis kanker stadium awal, klaim penyakit kritis",
        amount: 20000000,
        status: "pending",
        no_policy: user.no_policy,
        user_id: user.id,
        product_id: prodCrit.id,
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert("Claims", claims, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Claims", {
      reason: [
        "Rawat inap karena demam berdarah",
        "Diagnosis kanker stadium awal, klaim penyakit kritis",
      ],
    });
  },
};
