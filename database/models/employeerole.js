'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmployeeRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.TeamRoles);
      this.belongsTo(models.TeamMembership);
    }
  };
  EmployeeRole.init({
    TeamMembershipId: DataTypes.INTEGER,
    TeamRoleId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'EmployeeRole',
  });
  return EmployeeRole;
};