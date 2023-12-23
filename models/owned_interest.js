const {
    Model
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Owned_interest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
        static associate() {
            // define association here
        }
    }
    Owned_interest.init({
        interestId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Owned_interest',
        tableName: 'Owned_interests',
        underscored: true
    })
    return Owned_interest
}
