const request = require('supertest')

const app = require('../app')
const models = require('../models')
const authHelpers = require('../helpers/auth-helpers')

jest.mock('../helpers/auth-helpers')

// 1. 當 user 沒有登入時，進到 /pages/groupChats 頁面會被導到登入頁
// 2. 當 user 登入時，可以進到 /pages/groupChats 的頁面
// 3. 可以創造群組話題
// 4. 可以加入群組話題
// 5. 可以退出群組話題

describe('groupchat request', () => {
    describe('goupchat page', () => {
        // 當 user 沒有登入時，進到 /pages/groupchats 頁面會被導到登入頁
        describe('user not login', () => {
            test('should redirect to login page', async () => {
                const response = await request(app).get('/pages/groupChats')

                expect(response.status).toBe(302)
                expect(response.header.location).toBe('/pages/login')
            })
        })

        // 當 user 登入時，可以進到 /pages/groupChats 的頁面
        describe('user log in', () => {
            beforeAll(async () => {
            // 模擬登入資料
                authHelpers.ensureAuthenticated.mockReturnValue(true)
                authHelpers.getUser.mockReturnValue(
                    { 
                        id: 1, 
                        RegisteredGroups: [
                            {
                                id: 1,
                                name: 'User1 的 groupChat',
                                userId: 1
                            }
                        ] 
                    }
                )

                // 在測試資料庫中，新增 mock 資料
                await models.User.create({ id: 1 })
                await models.Group_chat.create({ userId: 1, name: 'User1 的 groupChat'})
                await models.Group_register.create({ groupId: 1, userId: 1 })
            })


            test('should render /pages/groupchats page', async () => {
                const response = await request(app)
                    .get('/pages/groupChats')
                    .set('Accept', 'text/html')

                expect(response.status).toBe(200)
                expect(response.text).toContain('User1 的 groupChat')
            })

            afterAll(async () => {
                jest.resetAllMocks()
                await models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
                await models.User.destroy({ where: {}, truncate: true, force: true })
                await models.Group_chat.destroy({ where: {}, truncate: true, force: true })
                await models.Group_register.destroy({ where: {}, truncate: true, force: true })
                await models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
            })
        })
    })

    describe('groupchat', () => {
        describe('post groupchat', () => {
            beforeAll(async () => {
                // 模擬登入資料
                authHelpers.ensureAuthenticated.mockReturnValue(true)
                authHelpers.getUser.mockReturnValue({ id: 1 })
    
                // 在測試資料庫中，新增 mock 資料
                await models.User.create({ id: 1 })
            })

            test('POST /groupChats', async () => {
                // 送出 request POST /groupChats
                const response = await request(app)
                    .post('/groupChats')
                    .send('name=groupChat1')
                    .set('Accept', 'application/json')

                expect(response.status).toBe(302)
            })

            test('should create current user groupchat', async () => {
                const groupChat = await models.Group_chat.findOne({ where: { userId: 1 } })
                expect(groupChat).not.toBeNull()
            })

            afterAll(async () => {
                jest.resetAllMocks()
                await models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
                await models.User.destroy({ where: {}, truncate: true, force: true })
                await models.Group_chat.destroy({ where: {}, truncate: true, force: true })
                await models.Group_register.destroy({ where: {}, truncate: true, force: true })
                await models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
            })
        })

        describe('when fail without login', () => {
            beforeAll(async () => {
                // 沒有登入資料
            })

            test('POST /groupChats', async () => {
                // 送出 request POST /groupChats，會失敗
                const response = await request(app)
                    .post('/groupChats')
                    .send('name=groupChat1')
                    .set('Accept', 'application/json')

                expect(response.status).toBe(302)
            })

            test('should not create groupchat', async () => {
                const groupChat = await models.Group_chat.findOne()
                expect(groupChat).toBeNull()
            })

            afterAll(async () => {
                // 不需清除資料
            })
        })

        // 測試當 groupchat 名稱為空字串，新增 groupchat 會失敗
        describe('when fail without validation', () => {
            beforeAll(async () => {
                // 模擬登入資料
                authHelpers.ensureAuthenticated.mockReturnValue(true)
                authHelpers.getUser.mockReturnValue({ id: 1 })
                // 在測試資料庫中，新增 mock 資料
                await models.User.create({ id: 1 })
            })

            test('POST /groupChats', async () => {
                // 送出 request POST /groupChats，會失敗
                const response = await request(app)
                    .post('/groupChats')
                    .send('name=')
                    .set('Accept', 'application/json')

                expect(response.status).toBe(302)
            })

            test('should not create groupchat', async () => {
                const groupChat = await models.Group_chat.findOne()
                expect(groupChat).toBeNull()
            })

            afterAll(async () => {
                jest.resetAllMocks()
                await models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
                await models.User.destroy({ where: {}, truncate: true, force: true })
                await models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
            })
        })
    })
})