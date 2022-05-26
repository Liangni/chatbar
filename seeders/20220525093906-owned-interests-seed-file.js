'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const SEED_USERS = ['user1', 'user2', 'user3']
    const SEED_INTERESTS = ['健身', '電影', '搖滾樂']

    // 取出SEED_USERS在資料庫的id
    const userIds = await Promise.all(SEED_USERS.map(async u => {
      const userData = await queryInterface.sequelize.query(
        `SELECT id FROM Users WHERE account = '${u}';`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )
      return userData[0]
    }))
    // 取出SSEED_INTERESTS在資料庫的id
    const interestIds = await Promise.all(SEED_INTERESTS.map(async i => {
      const interestData = await queryInterface.sequelize.query(
        `SELECT id FROM Interests WHERE name = '${i}';`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )
      return interestData[0]
    }))
    // 組裝要插入的Owned_interests資料
    const insertData = Array.from({ length: 3 }, (v, i) => {
      return {
        interest_id: interestIds[i].id,
        user_id: userIds[i].id,
        created_at: new Date(),
        updated_at: new Date()
      }
    })

    await queryInterface.bulkInsert('Owned_interests', insertData, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Owned_interests', null, {})
  }
};
