'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Users', 'district_id', {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Districts',
                key: 'id'
            }
        })
    },

    down: async (queryInterface) => {
        await queryInterface.removeColumn('Users', 'district_id')
    }
}
