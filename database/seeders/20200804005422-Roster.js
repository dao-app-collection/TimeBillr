"use strict";
const moment = require("moment");
const today = moment();
const startOfWeek = today.startOf("week").format("YYYY-MM-DD HH:mm:SS");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Rosters",
      [
        {
          weekStart: startOfWeek,
          TeamId: 1,
          complete: false,
        },
      ],
      {}
    );

    await queryInterface.bulkInsert("DaysShifts", [
      {
        RosterId: 1,
        day: 0,
        date: startOfWeek,
      },
      {
        RosterId: 1,
        day: 1,
        date: today.add(1, "d").format("YYYY-MM-DD HH:mm:SS"),
      },
      {
        RosterId: 1,
        day: 2,
        date: today.add(1, "d").format("YYYY-MM-DD HH:mm:SS"),
      },
      {
        RosterId: 1,
        day: 3,
        date: today.add(1, "d").format("YYYY-MM-DD HH:mm:SS"),
      },
      {
        RosterId: 1,
        day: 4,
        date: today.add(1, "d").format("YYYY-MM-DD HH:mm:SS"),
      },
      {
        RosterId: 1,
        day: 5,
        date: today.add(1, "d").format("YYYY-MM-DD HH:mm:SS"),
      },
      {
        RosterId: 1,
        day: 6,
        date: today.add(1, "d").format("YYYY-MM-DD HH:mm:SS"),
      },
    ]);
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
