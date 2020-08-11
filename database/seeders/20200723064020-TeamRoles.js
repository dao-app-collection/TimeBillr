"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add seed commands here.
    //     Example:
    await queryInterface.bulkInsert(
      "TeamRoles",
      [
        {
          Title: "In-store",
          TeamId: 1,
          casualRate: 16.5,
          partTimeRate: 14.5,
          fullTimeRate: 14.5,
        },
        {
          Title: "Driver",
          TeamId: 1,
          casualRate: 18.5,
          partTimeRate: 16.5,
          fullTimeRate: 16.5,
        },
        {
          Title: "Wobbler",
          TeamId: 1,
          casualRate: 13.5,
          partTimeRate: 11.5,
          fullTimeRate: 11.5,
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
