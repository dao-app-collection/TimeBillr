"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add seed commands here.
    //     Example:
    await queryInterface.bulkInsert(
      "EmployeeRoles",
      [
        {
          TeamMembershipId: 1,
          TeamRoleId: 1,
        },
        {
          TeamMembershipId: 2,
          TeamRoleId: 2,
        },
        {
          TeamMembershipId: 3,
          TeamRoleId: 3,
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
