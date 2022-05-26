'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const SEED_INTERESTS = ['健身', '電影', '搖滾樂']
    const insertData = SEED_INTERESTS.map(item => ({
      name: item,
      created_at: new Date(),
      updated_at: new Date()
    }))

    await queryInterface.bulkInsert('Interests', insertData, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Interests', null, {})
  }
};
