'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const SEED_USERS = ['user1', 'user2', 'user3']

    // 取出SEED_USERS在資料庫的id
    const userIds = await Promise.all(SEED_USERS.map(async u => {
      const userData = await queryInterface.sequelize.query(
        `SELECT id FROM Users WHERE account = '${u}';`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )
      return userData[0]
    }))
    // 組裝要插入的friendshipInvitations資料
    const insertData = [
      {
        sender_id: userIds[0].id,
        reciever_id: userIds[1].id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        sender_id: userIds[2].id,
        reciever_id: userIds[0].id,
        created_at: new Date(),
        updated_at: new Date()
      },
    ]

    await queryInterface.bulkInsert('Friendship_invitations', insertData, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Friendship_invitations', null, {})
  }
};
