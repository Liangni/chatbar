'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group_chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group_chat.belongsTo(models.User, { foreignKey: 'userId' })
      Group_chat.belongsToMany(models.User, {
        through: models.Group_register,
        foreignKey: 'groupId',
        as: 'RegisteredUsers'
      })
      Group_chat.hasMany(models.Group_message, { foreignKey: 'groupId' })
    }
  };
  Group_chat.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Group_chat',
    tableName: 'Group_chats',
    underscored: true,
  });
  return Group_chat;
};