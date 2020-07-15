"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TeamMembershipRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.TeamId = this.belongsTo(models.Team);
    }
  }
  TeamMembershipRequest.init(
    {
      email: DataTypes.STRING,
      permissions: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "TeamMembershipRequest",
    }
  );
  return TeamMembershipRequest;
};
