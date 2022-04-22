'use strict';
module.exports = (sequelize, DataTypes) => {
  const District = sequelize.define('District', {
    name: DataTypes.STRING
  }, {});
  District.associate = function(models) {
    // associations can be defined here
    District.hasMany(models.User)
    District.belongsTo(models.Area)
  };
  return District;
};