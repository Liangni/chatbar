'use strict';
module.exports = (sequelize, DataTypes) => {
  const Interest = sequelize.define('Interest', {
    name: DataTypes.STRING
  }, {});
  Interest.associate = function(models) {
    // associations can be defined here
    Interest.belongsToMany(models.User, {
      through: models.Owned_interest, // 透過 Owned_interests 表來建立關聯
      foreignKey: 'InterestId', // 對 Owned_interests 表設定 FK
      as: 'InterestOwners' // 幫這個關聯取個名稱
    });
  };
  return Interest;
};