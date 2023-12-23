'use strict'

module.exports = {
    up: async (queryInterface) => {
        const seeders = ['男性', '女性', '其他']
        await queryInterface.bulkInsert('Genders',
            seeders.map(item => {
                return {
                    name: item,
                    created_at: new Date(),
                    updated_at: new Date()
                }
            }),
            {}
        )
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('Genders', null, {})
    }
}
