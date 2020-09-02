'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Holidays extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.TeamMembership);
      this.belongsTo(models.Team);
    }
  };
  Holidays.init({
    start: DataTypes.DATE,
    end: DataTypes.DATE,
    approved: DataTypes.BOOLEAN,
    denied: DataTypes.BOOLEAN,
    TeamId: DataTypes.INTEGER,
    TeamMembershipId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Holidays',
  });
  return Holidays;
};