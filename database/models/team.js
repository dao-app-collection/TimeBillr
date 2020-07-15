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
      this.hasMany(models.TeamMembership);
      this.hasMany(models.TeamMembershipRequest);
      this.hasMany(models.Client);
      this.hasMany(models.Project);
    }
  }
  Team.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Team",
    }
  );
  return Team;
};
