"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TeamSettings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Team);
    }
  }
  TeamSettings.init(
    {
      weekStart: DataTypes.STRING,
      shiftReminders: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      paranoid: true,
      modelName: "TeamSettings",
    }
  );
  return TeamSettings;
};
