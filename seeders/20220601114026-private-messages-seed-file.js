'use strict'
const faker = require('faker')
module.exports = {
    up: async (queryInterface) => {
        const today = new Date()
        const SEED_USERS = ['user1', 'user2', 'user3']

        // 取出SEED_USERS在資料庫的id
        const userIds = await Promise.all(SEED_USERS.map(async u => {
            const userData = await queryInterface.sequelize.query(
                `SELECT id FROM Users WHERE account = '${u}';`,
                { type: queryInterface.sequelize.QueryTypes.SELECT }
            )
            return userData[0]
        }))
        // 組裝要插入的friendships資料
        const insertData = [
            {
                sender_id: userIds[1].id,
                reciever_id: userIds[2].id,
                content: faker.lorem.sentence(),
                created_at: new Date(today.setSeconds(1)),
                updated_at: new Date(today.setSeconds(1)),
            },
            {
                sender_id: userIds[2].id,
                reciever_id: userIds[1].id,
                content: faker.lorem.sentence(),
                created_at: new Date(today.setSeconds(2)),
                updated_at: new Date(today.setSeconds(2)),
            }
        ]

        await queryInterface.bulkInsert('Private_messages', insertData, {})
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('Private_messages', null, {})
    }
}
