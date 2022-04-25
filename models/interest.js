'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Interest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Interest.belongsTomMany(models.User, {
        through: models.OwnedInterest, // 透過 OwnedInterest 表來建立關聯
        foreignKey: 'interestId', // 對 OwnedInterest 表設定 FK
        as: 'InterestOwners' // 幫這個關聯取個名稱
      })
    }
  };
  Interest.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Interest',
    tableName: 'Interests',
    underscored: true,
  });
  return Interest;
};