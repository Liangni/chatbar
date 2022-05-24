const bcrypt = require('bcryptjs')

// 若採用JWT驗證，要加入如下
// const jwt = require('jsonwebtoken')
const { Gender, District, User, Interest, Owned_interest, Area, Group_message, Group_chat } = require('../models')
const { getUser } = require('../helpers/auth-helpers')
const { formatMessageTime } = require('../helpers/time-helpers')

const userController = {
    loginPage: (req, res) => {
        res.render('users/login')
    },
    registerPage: async (req, res, next) => {
        try {
            const genders = await Gender.findAll({ raw: true })
            const areas = await Area.findAll({ include: District })
            const areasData = areas.map(a => {
                a.Districts = a.Districts.map(d => (d.toJSON()))
                return {
                    id: a.id,
                    name: a.name,
                    districts: a.Districts
                }
            })
            res.render('users/register', { genders, areas: areasData })
        } catch (err) {
            next(err)
        }
    },
    register: async (req, res, next) => {
        try {
            const { account, password, confirmPassword, genderId, birthday, occupation, districtId, interest } = req.body

            if (!account || !password || !confirmPassword || !genderId || !birthday || !occupation || !districtId || !interest) throw new Error('所有欄位皆為必填!')
            if (password !== confirmPassword) throw new Error('密碼與確認密碼不一致!')

            const userData = await User.findOne({ where: { account } })
            if (userData) throw new Error('重複註冊帳號！')

            const newUser = await User.create({
                account,
                password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
                genderId,
                birthday,
                occupation,
                districtId
            })
            const interestData = await Interest.findOne({ where: { name: interest } })
            const userInterest = interestData ? interestData : await Interest.create({ name: interest })
            const newOwnedInterest = await Owned_interest.create({
                userId: newUser.id,
                interestId: userInterest.id
            })
            req.flash('success_messages', '註冊成功!')
            res.redirect('/users/login')
        } catch (err) {
            next(err)
        }
    },
    logIn: (req, res, next) => {
        try {
            req.flash('success_messages', '成功登入!')
            res.redirect('/groupChats')
            //如採用JWT，要取代成如下程式碼
            // 因為設定了{ session: false }，不會進入反序列化的程序，因此物件未被整理成JS的簡單物件
            // const userData = req.user.toJSON()
            // delete userData.password
            // 第一個參數必須是簡單物件
            // const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d'})
            // res.json({
            //     status: 'success',
            //     data: {
            //         token,
            //         user: userData
            //     }
            // })
        } catch (err) {
            next(err)
        }
    },
    logOut: (req, res) => {
        req.flash('success_messages', '成功登出!')
        // req.logout() 是 Passport.js 提供的函式，這個方法會把 user id 對應的 session 清除掉
        req.logout()
        res.redirect('/users/login')
    },
    getUsers: (req, res) => {
          res.render('users/userList', { path: 'userList'} )
    },
    getUserMessages: (req, res) => {
        res.render('users/userMessages', { path: 'getUserMessages' })
    },
    getUserGroupMessages: async (req, res, next) => {
        try {
            const loginUser = getUser(req)
            const RegisteredGroupIds = loginUser?.RegisteredGroups?.map(g => g.id) || null
            const groupId = req.query ? Number(req.query.groupId) : null
            let groupChats
            
            if (groupId) {
                if (!RegisteredGroupIds || !RegisteredGroupIds.includes(groupId)) throw new Error('你沒有加入此話題')
            }

            // 如登入使用者有加入話題，找出相關groupChat資料
            if (RegisteredGroupIds) {
                groupChats = await Promise.all(RegisteredGroupIds.map(async rgid => {
                    const groupChat = await Group_chat.findByPk(rgid, {
                        include: [
                            { model: Group_message, include: [User]},
                            User,
                            { model: User, as: 'RegisteredUsers' }
                        ],
                        order: [[Group_message, 'createdAt', 'ASC']]
                    })
                    const groupChatData = groupChat.toJSON()
                    // 為每條訊息加入是否為登入使用者的判斷、調整時間格式
                    groupChatData.Group_messages = groupChatData.Group_messages ? groupChatData.Group_messages.map(m => ({
                        ...m,
                        isLoginUser: (loginUser.id === m.User.id),
                        formattedCreatedAt: formatMessageTime(m.createdAt)
                    })) : null
                    
                    
                    // 取出最近一則訊息，取出前先拷貝groupMessages的值，避免更動groupMessages
                    const groupMessageData = groupChatData.Group_messages ? JSON.parse(JSON.stringify(groupChatData.Group_messages)) : null
                    const latestMessage = groupMessageData?.[groupMessageData.length - 1] || null
                    if (latestMessage) {
                        // 刪減過長的訊息文字
                        if (latestMessage.content && latestMessage.content.length > 15) {
                            latestMessage.content = latestMessage.content.substring(0, 14) + '...'
                        }
                    }
                    
                    // 返回前端需要的groupChat資訊, 與相關的最近一則訊息
                    return {
                        name: groupChatData.name,
                        id: groupChatData.id,
                        User: groupChatData.User,
                        RegisteredUsers: groupChatData.RegisteredUsers,
                        Group_messages: groupChatData.Group_messages,
                        latestMessage,
                    }
                }))
                
                // 將groupChat按日期新->舊排序，沒有訊息的chat置頂
                let chatsWithNoMessage = []
                for (let i = groupChats.length - 1; i >= 0; i = i - 1 ) {
                    if (groupChats[i].Group_messages.length === 0) {
                        const removed = groupChats.splice(i, 1)
                        chatsWithNoMessage.unshift(...removed)
                    }
                }
                groupChats = chatsWithNoMessage.concat(groupChats.sort((a, b) => new Date(b.latestMessage.createdAt) - new Date(a.latestMessage.createdAt))) 
                
            }

            // 選擇要顯示所有訊息的groupChat
            let unfoldedGroupChat
            if(groupId) {
                unfoldedGroupChat = groupChats.find( i => i.id === groupId)
            } else {
                unfoldedGroupChat = groupChats[0]
            }

            res.render('users/userMessages', {
                path: 'getUserGroupMessages',
                groupChats: groupChats || null,
                unfoldedGroupChat: unfoldedGroupChat || null
            })
        } catch (err) {
            next(err)
        }
    },
    
}

module.exports = userController