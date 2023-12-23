'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Group_chats', 'user_id', {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        })
    },

    down: async (queryInterface) => {
        await queryInterface.removeColumn('Group_chats', 'user_id')
    }
}
