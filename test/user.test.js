const request = require('supertest')
const bcrypt = require('bcryptjs')

const app = require('../app')
const models = require('../models')

// 使用者相關功能測試
// 1. 可以登入
// 2. 可以登出
// 3. 可以註冊

// 登入功能測試
describe('login requests', () => {
    describe('if user want to signin', () => {
        beforeAll(async () => {
            // 在測試資料庫新增一個 user
            await models.User.create({
                account: 'User1',
                password: bcrypt.hashSync('User1', bcrypt.genSaltSync(10), null),
                isAdmin: false 
            })
        })

        test('should render login page', async () => {
            const response = await request(app).get('/pages/login')
            expect(response.status).toBe(200)
        })

        afterAll(async() => {
            // 清除測試 db 中的 User 資料
            await models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
            await models.User.destroy({ where: {}, truncate: true, force: true})
            await models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
        })
    })
})