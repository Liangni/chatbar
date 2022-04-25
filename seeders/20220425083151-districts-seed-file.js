'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const seeders = {
      臺灣北部: ['台北市', '新北市', '桃園市', '新竹市', '新竹縣', '宜蘭縣', '基隆市'],
      臺灣中部: ['台中市', '彰化縣', '雲林縣', '苗栗縣', '南投縣'],
      臺灣南部: ['高雄市', '台南市', '嘉義市', '嘉義縣', '屏東縣'],
      臺灣東部: ['台東縣', '花蓮縣', '澎湖縣', '金門縣', '連江縣']
    }

    for (const key in seeders) {
      const area = await queryInterface.sequelize.query(
        `SELECT id FROM Areas WHERE name = '${key}';`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )
      await queryInterface.bulkInsert('Districts',
        seeders[key].map(district => {
          return {
            name: district,
            area_id: area[0].id,
            created_at: new Date(),
            updated_at: new Date()
          }
        }),
        {}
      )
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Districts', null, {});
  }
};
