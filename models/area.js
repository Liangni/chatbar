'use strict';
module.exports = (sequelize, DataTypes) => {
  const Area = sequelize.define('Area', {
    name: DataTypes.STRING
  }, {});
  Area.associate = function(models) {
    // associations can be defined here
    Area.hasMany(models.District)
  };
  return Area;
};