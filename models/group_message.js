const {
    Model
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Group_message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
        static associate(models) {
            // define association here
            Group_message.belongsTo(models.Group_chat, { foreignKey: 'groupId' })
            Group_message.belongsTo(models.User, { foreignKey: 'userId' })
        }
    }
    Group_message.init({
        content: DataTypes.TEXT,
        file: DataTypes.STRING,
        image: DataTypes.STRING,
        imageSrc: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Group_message',
        tableName: 'Group_messages',
        underscored: true
    })
    return Group_message
}
