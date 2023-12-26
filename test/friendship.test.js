const request = require('supertest')

const app = require('../app')
const models = require('../models')
const authHelpers = require('../helpers/auth-helpers')

jest.mock('../helpers/auth-helpers')

// 1. 當 user 沒有登入時，進到 /pages/users 頁面會被導到登入頁
// 2. 當 user 登入時，可以進到 /pages/users 的頁面
// 3. 可以發送交友邀請
// 4. 可以收回交友邀請
// 5. 可以拒絕交友邀請
// 6. 可以接受交友邀請
// 7. 可以解除友誼
// 8. 可以查看所有交友邀請

describe('friendship request', () => {
    describe('users page', () => {
        // 當 user 沒有登入時，進到 /pages/users 頁面會被導到登入頁
        describe('user not login', () => {
            test('should redirect to login page', async () => {
                const response = await request(app).get('/pages/users')

                expect(response.status).toBe(302)
                expect(response.header.location).toBe('/pages/login')
            })
        })

        // 當 user 登入時，可以進到 /pages/users 的頁面
        describe('user log in', () => {
            beforeAll(async () => {
            // 模擬登入資料
                authHelpers.ensureAuthenticated.mockReturnValue(true)
                authHelpers.getUser.mockReturnValue({ 
                    id: 1,
                    Friends: [],
                    FriendshipInvitationSenders: [],
                    FriendshipInvitationRecievers: []
                })

                // 在測試資料庫中，新增 mock 資料
                await models.User.bulkCreate([
                    { id: 1, account: 'User1' },
                    { id: 2, account: 'User2', birthday: new Date() }
                ])
            })


            test('should render /pages/users page', async () => {
                const response = await request(app)
                    .get('/pages/users')
                    .set('Accept', 'text/html')

                expect(response.status).toBe(200)
                expect(response.text).toContain('User2')
            })

            afterAll(async () => {
                jest.resetAllMocks()
                await models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
                await models.User.destroy({ where: {}, truncate: true, force: true })
                await models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
            })
        })
    })

    describe('friendship invitation', () => {
        describe('POST /users/:id/friendshipInvitations', () => {
            beforeAll(async () => {
                // 模擬登入資料
                authHelpers.ensureAuthenticated.mockReturnValue(true)
                authHelpers.getUser.mockReturnValue({ id: 1 })
    
                // 在測試資料庫中，新增 mock 資料
                await models.User.bulkCreate([
                    { id: 1, account: 'User1' },
                    { id: 2, account: 'User2' }
                ])
            })

            test('POST /friendships/users/:id/friendshipInvitations', async () => {
                // 送出 request POST /groupChats
                const response = await request(app)
                    .post('/friendships/users/2/friendshipInvitations')
                    .set('Accept', 'application/json')

                expect(response.status).toBe(302)
            })

            test('should create current user friendship invitation', async () => {
                const friendshipInvitation = await models.Friendship_invitation.findOne({ where: { senderId: 1, recieverId: 2 } })
                expect(friendshipInvitation).not.toBeNull()
            })

            afterAll(async () => {
                jest.resetAllMocks()
                await models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
                await models.User.destroy({ where: {}, truncate: true, force: true })
                await models.Friendship_invitation.destroy({ where: {}, truncate: true, force: true })
                await models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
            })
        })

        describe('delete friendshipInvitations', () => {
            describe('sender delete friendshipInvitations', () => {
                beforeAll(async () => {
                    // 模擬登入資料
                    authHelpers.ensureAuthenticated.mockReturnValue(true)
                    authHelpers.getUser.mockReturnValue({ id: 1 })
        
                    // 在測試資料庫中，新增 mock 資料
                    await models.User.bulkCreate([
                        { id: 1, account: 'User1' },
                        { id: 2, account: 'User2' }
                    ])
                    await models.Friendship_invitation.create({ senderId: 1, recieverId: 2 })
                })
    
                test('DELETE /friendships/users/:userId/friendshipInvitations', async() => {
                    const response = await request(app)
                        .post('/friendships/users/2/friendshipInvitations')
                        .set('Accept', 'application/json')
    
                    expect(response.status).toBe(302)
                })
    
                test('should create current user friendship invitation', async () => {
                    const friendshipInvitation = await models.Friendship_invitation.findOne({ where: { senderId: 1, recieverId: 2 } })
                    expect(friendshipInvitation).not.toBeNull()
                })
    
                afterAll(async () => {
                    jest.resetAllMocks()
                    await models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
                    await models.User.destroy({ where: {}, truncate: true, force: true })
                    await models.Friendship_invitation.destroy({ where: {}, truncate: true, force: true })
                    await models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
                })
            })

            describe('reciever delete friendshipInvitations', () => {
                beforeAll(async () => {
                    // 模擬登入資料
                    authHelpers.ensureAuthenticated.mockReturnValue(true)
                    authHelpers.getUser.mockReturnValue({ id: 2 })
        
                    // 在測試資料庫中，新增 mock 資料
                    await models.User.bulkCreate([
                        { id: 1, account: 'User1' },
                        { id: 2, account: 'User2' }
                    ])
                    await models.Friendship_invitation.create({ senderId: 1, recieverId: 2 })
                })
    
                test('DELETE /friendships/users/:userId/friendshipInvitations', async() => {
                    const response = await request(app)
                        .post('/friendships/users/1/friendshipInvitations')
                        .set('Accept', 'application/json')
    
                    expect(response.status).toBe(302)
                })
    
                test('should create current user friendship invitation', async () => {
                    const friendshipInvitation = await models.Friendship_invitation.findOne({ where: { senderId: 1, recieverId: 2 } })
                    expect(friendshipInvitation).not.toBeNull()
                })
    
                afterAll(async () => {
                    jest.resetAllMocks()
                    await models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
                    await models.User.destroy({ where: {}, truncate: true, force: true })
                    await models.Friendship_invitation.destroy({ where: {}, truncate: true, force: true })
                    await models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
                })
            })

            
            
        })



    })
})