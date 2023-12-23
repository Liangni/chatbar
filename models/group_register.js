const {
    Model
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Group_register extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
        static associate() {
            // define association here
        }
    }
    Group_register.init({
        groupId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Group_register',
        tableName: 'Group_registers',
        underscored: true
    })
    return Group_register
}
