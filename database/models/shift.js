"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Shift extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.DaysShift);
      this.belongsTo(models.TeamMembership);
      this.belongsTo(models.TeamRoles);
    }
  }
  Shift.init(
    {
      start: DataTypes.DATE,
      end: DataTypes.DATE,
      DaysShiftId: DataTypes.INTEGER,
      TeamMembershipId: DataTypes.INTEGER,
      TeamRoleId: DataTypes.INTEGER,
      confirmed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Shift",
    }
  );
  return Shift;
};
