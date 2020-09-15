"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //  Add seed commands here.

    await queryInterface.bulkInsert(
      "TeamMemberships",
      [
        {
          permissions: "owner",
          employmentType: "fullTime",
          UserId: 1,
          TeamId: 1,
        },
        {
          permissions: "manager",
          employmentType: "partTime",
          UserId: 2,
          TeamId: 1,
        },
        {
          permissions: "employee",
          employmentType: "fullTime",
          UserId: 3,
          TeamId: 1,
        },
        {
          permissions: "employee",
          employmentType: "casual",
          UserId: 4,
          TeamId: 1,
        },
        {
          permissions: "employee",
          employmentType: "casual",
          UserId: 5,
          TeamId: 1,
        },
        {
          permissions: "employee",
          employmentType: "casual",
          UserId: 6,
          TeamId: 1,
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
