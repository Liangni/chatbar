'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Friendship_invitation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Friendship_invitation.belongsTo(models.User, { foreignKey: 'senderId' })
    }
  };
  Friendship_invitation.init({
    senderId: DataTypes.INTEGER,
    recieverId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Friendship_invitation',
    tableName: 'Friendship_invitations',
    underscored: true,
  });
  return Friendship_invitation;
};