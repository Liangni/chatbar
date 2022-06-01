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
      // One-to-Many
      User.hasMany(models.Group_chat, { foreignKey:'userId' })
      User.hasMany(models.Group_message, { foreignKey: 'userId'})
      User.hasMany(models.Friendship_invitation, { foreignKey: 'senderId' })
      User.hasMany(models.Private_message, { foreignKey: 'senderId' })
      User.hasMany(models.Private_message, { foreignKey: 'receiverId' })

      // Many-to-One
      User.belongsTo(models.Gender, { foreignKey: 'genderId' })
      User.belongsTo(models.District, { foreignKey: 'districtId' })

      // Many-to-Many
      User.belongsToMany(models.Interest, {
        through: models.Owned_interest, // 透過 Owned_interest 表來建立關聯
        foreignKey: 'userId', // 對 Owned_interest 表設定 FK
        as: 'CurrentInterests' // 幫這個關聯取個名稱
      })
      User.belongsToMany(models.Group_chat, {
        through: models.Group_register,
        foreignKey: 'userId',
        as: 'RegisteredGroups'
      })
      User.belongsToMany(models.User, {
        through: models.Friendship_invitation,
        foreignKey: 'senderId',
        as: 'FriendshipInvitationRecievers'
      })
      User.belongsToMany(models.User, {
        through: models.Friendship_invitation,
        foreignKey: 'recieverId',
        as: 'FriendshipInvitationSenders'
      })
      User.belongsToMany(models.User, {
        through: models.Friendship,
        foreignKey: 'userId',
        as: 'Friends'
      })
    }
  };
  User.init({
    account: DataTypes.STRING,
    password: DataTypes.STRING,
    birthday: DataTypes.DATE,
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