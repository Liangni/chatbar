const request = require('supertest')
const bcrypt = require('bcryptjs')

const app = require('../app')
const models = require('../models')

// 使用者相關功能測試
// 1. 可以登入
// 2. 可以註冊

// 登入功能測試
describe('login requests', () => {
    describe('if user want to login', () => {
        beforeAll(async () => {
            // 在測試資料庫新增一個 user
            await models.User.create({
                account: 'User1',
                password: bcrypt.hashSync('User1', bcrypt.genSaltSync(10), null),
                isAdmin: false 
            })
        })

        // 確認可以顯示 GET /pages/login 的頁面
        test('should render login page', async () => {
            const response = await request(app).get('/pages/login')
            expect(response.status).toBe(200)
        })

        test('should login successfully', async() => {
            // 送出 request POST /users/login
            const response = await request(app)
                .post('/users/login')
                .send('account=User1&password=User1')
                .set('Accept', 'application/json')
            
            expect(response.status).toBe(302)
            expect(response.header.location).toBe('/pages/groupChats')
        })

        // 測試：登入失敗是否會回到 /pages/login 頁面
        test('should fail to login and redirect to /pages/login', async () => {
            const response = await request(app)
                .post('/users/login')
                .send('')
                .set('Accept', 'application/json')

            expect(response.status).toBe(302)
            expect(response.header.location).toBe('/pages/login')
        })

        afterAll(async() => {
            // 清除測試 db 中的 User 資料
            await models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
            await models.User.destroy({ where: {}, truncate: true, force: true})
            await models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
        })
    })
})

// 註冊功能測試
describe('register request', () => {
    describe('if user want to register', () => {
        beforeAll(async () => {
            // 在測試資料庫新增一個 gender、district
            await models.Gender.create({})
            await models.District.create({})
        })

        // 確認可以顯示 GET /pages/register 的頁面
        test('should render the register page', async () => {
            const response = await request(app).get('/pages/register')
            expect(response.status).toBe(200)
        })

        test('should register successfully', async() => {
            const birthday = new Date(1990, 0, 1)
            const isoFormattedBirthday = birthday.toISOString()

            const response = await request(app)
                .post('/users/register')
                .send(`account=User1&password=User1&confirmPassword=User1&genderId=1&birthday=${isoFormattedBirthday}&occupation=User1&districtId=1&interest=User1`)
                .set('Accept', 'application/json')

            expect(response.status).toBe(302)
            expect(response.header.location).toBe('/pages/login')
        })

        afterAll(async () => {
            await models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
            await models.User.destroy({ where: {}, truncate: true, force: true })
            await models.Gender.destroy({ where: {}, truncate: true, force: true })
            await models.District.destroy({ where: {}, truncate: true, force: true })
            await models.Interest.destroy({ where: {}, truncate: true, force: true })
            await models.Owned_interest.destroy({ where: {}, truncate: true, force: true })
            await models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
        })
    })
})