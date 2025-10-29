"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const products = [
      {
        id: uuidv4(),
        name: "PRUActive Life",
        description:
          "Asuransi jiwa fleksibel dengan perlindungan komprehensif yang bisa disesuaikan dengan kebutuhan hidup dan investasi jangka panjang.",
        premium_amount: 500000,
        max_claim_amount: 50000000,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: "PRUCritical Care 90",
        description:
          "Perlindungan untuk 90 kondisi penyakit kritis, memberikan manfaat lump sum agar tetap fokus pada pemulihan.",
        premium_amount: 350000,
        max_claim_amount: 25000000,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: "PRUHospital & Surgical Cover Plus",
        description:
          "Asuransi kesehatan yang menanggung biaya rawat inap, pembedahan, dan tindakan medis di jaringan RS rekanan.",
        premium_amount: 250000,
        max_claim_amount: 10000000,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: "PRUEducation Saver",
        description:
          "Asuransi pendidikan dengan perlindungan jiwa & nilai tunai untuk menjamin masa depan anak.",
        premium_amount: 400000,
        max_claim_amount: 30000000,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: "PRUlink Syariah Investor Account",
        description:
          "Unit link syariah dengan peluang pertumbuhan nilai investasi yang optimal.",
        premium_amount: 600000,
        max_claim_amount: 80000000,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: "PRUHealth Infinite",
        description:
          "Perlindungan kesehatan premium tanpa batas tahunan, mencakup rawat inap internasional.",
        premium_amount: 800000,
        max_claim_amount: 100000000,
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert("Products", products, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Products", null, {});
  },
};
