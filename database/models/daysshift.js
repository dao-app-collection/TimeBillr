"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DaysShift extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Roster);
      this.hasMany(models.Shift);
      // define association here
    }
  }
  DaysShift.init(
    {
      RosterId: DataTypes.INTEGER,
      day: DataTypes.INTEGER,
      date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "DaysShift",
    }
  );
  return DaysShift;
};
