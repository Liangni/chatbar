'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Private_message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Private_message.belongsTo(models.User, { foreignKey: 'recieverId' })
      Private_message.belongsTo(models.User, { foreignKey: 'senderId' })
    }
  };
  Private_message.init({
    content: DataTypes.TEXT,
    file: DataTypes.STRING,
    image: DataTypes.STRING,
    imageSrc: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Private_message',
    tableName: 'Private_messages',
    underscored: true,
  });
  return Private_message;
};