'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    account: DataTypes.STRING,
    password: DataTypes.STRING,
    occupation: DataTypes.STRING,
    avatar: DataTypes.STRING,
    intro: DataTypes.TEXT,
    isAdmin: DataTypes.BOOLEAN
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.belongsTo(models.Gender)
    User.belongsTo(models.District)
    User.belongsToMany(models.Interest, {
      through: models.Owned_interest, // 透過 Owned_interests 表來建立關聯
      foreignKey: 'UserId', // 對 Owned_interests 表設定 FK
      as: 'CurrentInterests' // 幫這個關聯取個名稱
    });
  return User;
  }
};