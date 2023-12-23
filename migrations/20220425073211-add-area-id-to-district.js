'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Districts', 'area_id', {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Areas',
                key: 'id'
            }
        })
    },

    down: async (queryInterface) => {
        await queryInterface.removeColumn('Districts', 'area_id')
    }
}
