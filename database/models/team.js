"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.TeamMembership, { onDelete: "cascade" });
      this.hasMany(models.TeamMembershipRequest, { onDelete: "cascade" });

      this.hasOne(models.TeamSettings);
      this.hasMany(models.TeamRoles, { onDelete: "cascade" });
    }
  }
  Team.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      paranoid: true,
      modelName: "Team",
    }
  );
  return Team;
};
