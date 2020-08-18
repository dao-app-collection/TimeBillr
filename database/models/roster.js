"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Roster extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Team);
      // this.hasMany(models.Shift);
      this.hasMany(models.DaysShift);
    }
  }
  Roster.init(
    {
      weekStart: DataTypes.DATE,
      TeamId: DataTypes.INTEGER,
      complete: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Roster",
    }
  );
  return Roster;
};
