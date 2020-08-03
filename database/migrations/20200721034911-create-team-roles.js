'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TeamRoles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()'),
      },
      TeamId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Teams",
          key: "id",
        },
      },
      casualRate:{
        type: Sequelize.DECIMAL(10,2),
        allowNull:false,
      },
      partTimeRate: {
        type: Sequelize.DECIMAL(10,2),
        allowNull:false,
      },
      fullTimeRate:{
        type: Sequelize.DECIMAL(10,2),
        allowNull:false,
      },
      deletedAt: {
        type: Sequelize.DATE
    }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('TeamRoles');
  }
};