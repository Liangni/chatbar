'use strict'

module.exports = {
    up: async (queryInterface) => {
        const SEED_GROUP_CHATS = ['groupChat1', 'groupChat2', 'groupChat3']
        const SEED_USER = 'user1'

        const userData = await queryInterface.sequelize.query(
            `SELECT id FROM Users WHERE account = '${SEED_USER}';`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        )
        await queryInterface.bulkInsert('Group_chats', SEED_GROUP_CHATS.map( g => ({
            name: g,
            user_id: userData[0].id,
            created_at: new Date(),
            updated_at: new Date()
        })), {})
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('Group_chats', null, {})
    }
}
