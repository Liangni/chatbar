'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Group_messages', 'group_id', {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Group_chats',
                key: 'id'
            }
        })
    },

    down: async (queryInterface) => {
        await queryInterface.removeColumn('Group_messages', 'group_id')
    }
}
