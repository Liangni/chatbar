const request = require('supertest')

const app = require('../app')

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
        
    })
})