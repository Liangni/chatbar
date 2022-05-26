'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const SEED_USERS = [
      {
        account: 'user1',
        password: '12345678',
        birthday: new Date(1991, 2, 1),
      },
      {
        account: 'user2',
        password: '12345678',
        birthday: new Date(1994, 3, 1),
      },
      {
        account: 'user3',
        password: '12345678',
        birthday: new Date(1998, 5, 1),
      },
    ]
    const SEED_GENDER = '男性'
    const SEED_DISTRICT = '台北市'
    
    const genderData = await queryInterface.sequelize.query(
      `SELECT id FROM Genders WHERE name = '${SEED_GENDER}';`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const districtData = await queryInterface.sequelize.query(
      `SELECT id FROM Districts WHERE name = '${SEED_DISTRICT}';`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const userData = SEED_USERS.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null),
      avatar: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100) + 1}.jpg`,
      intro: faker.lorem.paragraph(),
      gender_id: genderData[0].id,
      district_id: districtData[0].id,
      created_at: new Date(),
      updated_at: new Date()
    }))
    
    await queryInterface.bulkInsert('Users', userData, {});
    
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  
  }
};
