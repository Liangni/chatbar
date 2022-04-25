'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Gender, { foreignKey:'genderId' })
      User.belongsTo(models.District, { foreignKey: 'districtId' })
    }
  };
  User.init({
    account: DataTypes.STRING,
    password: DataTypes.STRING,
    birthdate: DataTypes.DATE,
    occupation: DataTypes.STRING,
    avatar: DataTypes.STRING,
    intro: DataTypes.TEXT,
    isAdmin: DataTypes.BOOLEAN // 設定ORM操作欄位用lowerCamelCase
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users', // 指定table名稱
    underscored: true // 設定ORM使用的lowerCamelCase與資料庫使用的snake-case相互轉換
  });
  return User;
};