'use strict'

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert('Areas',
            ['臺灣北部', '臺灣中部', '臺灣南部', '臺灣東部']
                .map(item => ({
                    name: item,
                    created_at: new Date(),
                    updated_at: new Date()
                })),
            {}
        )
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('Areas', null, {})
    }
}
