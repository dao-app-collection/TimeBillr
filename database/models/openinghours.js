'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OpeningHours extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.TeamSettings);
    }
  };
  OpeningHours.init({
    TeamSettingId: DataTypes.INTEGER,
    open: DataTypes.INTEGER,
    close: DataTypes.INTEGER,
    day: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'OpeningHours',
  });
  return OpeningHours;
};