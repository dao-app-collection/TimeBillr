"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Shifts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      start: {
        type: Sequelize.DATE,
      },
      end: {
        type: Sequelize.DATE,
      },
      DaysShiftId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "DaysShifts",
          key: "id",
        },
      },
      TeamMembershipId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "TeamMemberships",
          key: "id",
        },
      },
      TeamRoleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "EmployeeRoles",
          key: "id",
        },
      },
      confirmed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP()"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()"
        ),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Shifts");
  },
};
