"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TeamMembership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      console.log(models);
      // define association here
      this.TeamId = this.belongsTo(models.Team);
      this.UserId = this.belongsTo(models.User);
      this.hasMany(models.EmployeeRole, { onDelete: 'cascade' });
      this.hasMany(models.Unavailable, {onDelete: 'cascade'});
    }
  }
  TeamMembership.init(
    {
      permissions: DataTypes.STRING,
      employmentType: DataTypes.STRING,
    },
    {
      sequelize,
      paranoid: true,
      modelName: "TeamMembership",
    }
  );
  return TeamMembership;
};
