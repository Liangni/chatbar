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
        avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
      },
      {
        account: 'user2',
        password: '12345678',
        birthday: new Date(1994, 3, 1),
        avatar: 'https://images.unsplash.com/photo-1534471770828-9bde524ee634?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870'
      },
      {
        account: 'user3',
        password: '12345678',
        birthday: new Date(1998, 5, 1),
        avatar: 'https://images.unsplash.com/photo-1611403119860-57c4937ef987?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80'
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
