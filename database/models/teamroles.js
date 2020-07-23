'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TeamRoles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Team);
    }
  };
  TeamRoles.init({
    title: DataTypes.STRING,
    casualRate: DataTypes.DECIMAL,
    partTimeRate: DataTypes.DECIMAL,
    fullTimeRate: DataTypes.DECIMAL,
  }, {
    sequelize,
    modelName: 'TeamRoles',
  });
  return TeamRoles;
};