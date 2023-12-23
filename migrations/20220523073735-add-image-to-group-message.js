'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Group_messages', 'image', {
            type: Sequelize.STRING
        })
    },

    down: async (queryInterface) => {
        await queryInterface.removeColumn('Group_messages', 'image')
    }
}
