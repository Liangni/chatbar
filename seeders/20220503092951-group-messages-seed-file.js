'use strict'
const faker = require('faker')
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
        // 組裝要插入的groupMessages資料
        const insertData = Array.from({ length: 9 }, (v, i) => {
            const today = new Date()
            return {
                group_id: groupChatIds[(i - (i % 3)) / 3].id,
                user_id: userIds[i % 3].id,
                content: faker.lorem.sentence(),
                created_at: new Date(today.setSeconds(i)),
                updated_at: new Date(today.setSeconds(i)),
            }
        })

        await queryInterface.bulkInsert('Group_messages', insertData, {})
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('Group_messages', null, {})
    }
}
