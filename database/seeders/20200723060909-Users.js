const bcrypt = require("bcrypt");
require("dotenv").config();
("use strict");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add seed commands here.

    // Example:
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          firstName: "Clinton",
          lastName: "Gillespie",
          password: await bcrypt.hash("clinton2", process.env.SALTROUNDS || 10),
          email: "clinnygee@outlook.com",
          emailVerified: true,
        },
        {
          firstName: "Jason",
          lastName: "Taylor",
          password: await bcrypt.hash("clinton2", process.env.SALTROUNDS || 10),
          email: "clintongillespie@outlook.com",
          emailVerified: true,
        },
        {
          firstName: "Joseph",
          lastName: "Thompson",
          password: await bcrypt.hash("clinton2", process.env.SALTROUNDS || 10),
          email: "clinton.gillespie@outlook.com",
          emailVerified: true,
        },
        {
          firstName: "David",
          lastName: "Young",
          password: await bcrypt.hash("clinton2", process.env.SALTROUNDS || 10),
          email: "david@outlook.com",
          emailVerified: true,
        },
        {
          firstName: "Steph",
          lastName: "Young",
          password: await bcrypt.hash("clinton2", process.env.SALTROUNDS || 10),
          email: "steph@outlook.com",
          emailVerified: true,
        },
        {
          firstName: "Micheala",
          lastName: "Nemhauser",
          password: await bcrypt.hash("clinton2", process.env.SALTROUNDS || 10),
          email: "micki@outlook.com",
          emailVerified: true,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
