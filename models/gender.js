'use strict';
module.exports = (sequelize, DataTypes) => {
  const Gender = sequelize.define('Gender', {
    name: DataTypes.STRING
  }, {});
  Gender.associate = function(models) {
    // associations can be defined here
    Gender.hasMany(models.User)
  };
  return Gender;
};