'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
    up: async (queryInterface) => {
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
                avatar: 'https://images.unsplash.com/photo-1618287520963-df8f2ab53c91?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=464&q=80'
            },
            {
                account: 'user3',
                password: '12345678',
                birthday: new Date(1998, 5, 1),
                avatar: 'https://images.unsplash.com/photo-1504131598085-4cca8500b677?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=869&q=80'
            },
        ]
        const SEED_GENDERS = ['男性', '女性', '其他']
        const SEED_DISTRICTS = ['台北市', '台中市', '高雄市']
    
        // 取出SEED_GENDER在資料庫的id
        const genderIds = await Promise.all(SEED_GENDERS.map(async name => {
            const genderData = await queryInterface.sequelize.query(
                `SELECT id FROM Genders WHERE name = '${name}';`,
                { type: queryInterface.sequelize.QueryTypes.SELECT }
            )
            return genderData[0]
        }))
    

        // 取出SEED_DISTRICT在資料庫的id
        const districtIds = await Promise.all(SEED_DISTRICTS.map(async name => {
            const districtData = await queryInterface.sequelize.query(
                `SELECT id FROM Districts WHERE name = '${name}';`,
                { type: queryInterface.sequelize.QueryTypes.SELECT }
            )
            return districtData[0]
        }))


        const insertData = Array.from({ length: 3 }, (v, i) => ({
            ...SEED_USERS[i],
            password: bcrypt.hashSync(SEED_USERS[i].password, bcrypt.genSaltSync(10), null),
            intro: faker.lorem.paragraph(),
            gender_id: genderIds[i].id,
            district_id: districtIds[i].id,
            created_at: new Date(),
            updated_at: new Date()
        }))
    
        await queryInterface.bulkInsert('Users', insertData, {})
    
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('Users', null, {})
  
    }
}
