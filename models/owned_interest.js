'use strict';
module.exports = (sequelize, DataTypes) => {
  const Owned_interest = sequelize.define('Owned_interest', {
    userId: DataTypes.INTEGER,
    interestId: DataTypes.INTEGER
  }, {});
  Owned_interest.associate = function(models) {
    // associations can be defined here
  };
  return Owned_interest;
};