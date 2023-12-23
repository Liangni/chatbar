'use strict'

module.exports = {
    up: async (queryInterface) => {
        const SEED_GROUP_CHATS = ['groupChat1', 'groupChat2', 'groupChat3']
        const SEED_USERS = ['user1', 'user2', 'user3']
        // 取出SEED_GROUP_CHATS在資料庫的id
        const groupChatIds = await Promise.all(SEED_GROUP_CHATS.map(async g => {
            const groupChatData = await queryInterface.sequelize.query(
                `SELECT id FROM Group_chats WHERE name = '${g}';`,
                { type: queryInterface.sequelize.QueryTypes.SELECT }
            )
            return groupChatData[0]
        }))
        // 取出SEED_USERS在資料庫的id
        const userIds = await Promise.all(SEED_USERS.map(async u => {
            const userData = await queryInterface.sequelize.query(
                `SELECT id FROM Users WHERE account = '${u}';`,
                { type: queryInterface.sequelize.QueryTypes.SELECT }
            )
            return userData[0]
        }))
        // 組裝要插入的groupRegister資料
        const insertData = Array.from({length: 9}, (v, i) => {
            return {
                group_id: groupChatIds[(i - (i % 3)) / 3 ].id,
                user_id: userIds[i % 3].id,
                created_at: new Date(),
                updated_at: new Date()
            }
        })
    
        await queryInterface.bulkInsert('Group_registers', insertData, {})
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('Group_registers', null, {})
    }
}
