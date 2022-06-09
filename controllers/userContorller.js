const bcrypt = require('bcryptjs')
const { Op } = require("sequelize")
const dayjs = require('dayjs')
// 若採用JWT驗證，要加入如下
// const jwt = require('jsonwebtoken')
const { Gender, District, User, Interest, Owned_interest, Area, Friendship_invitation, Friendship, Group_message, Group_chat, Private_message, sequelize } = require('../models')
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
    getUsers: async (req, res, next) => {
        try {
            const loginUser = getUser(req)
            const FriendIds = loginUser.Friends.length ? loginUser.Friends.map(f => f.id) : []
            const FriendshipInvitationSenderIds = loginUser.FriendshipInvitationSenders.length ? loginUser.FriendshipInvitationSenders.map(s => s.id) : []
            const FriendshipInvitationRecieverIds = loginUser.FriendshipInvitationRecievers.length ? loginUser.FriendshipInvitationRecievers.map(s => s.id) : []

            const users = await User.findAll({
                where: { id: { [Op.not]: loginUser.id } },
                include: [Gender, { model: District, include: Area }, { model: Interest, as: 'CurrentInterests' }],
            })
            const usersData = users.map(u => {
                // 計算使用者年齡
                const today = dayjs(new Date())
                const age = today.diff(u.birthday, 'year')

                // 定義使用者與登入使用者的朋友關係
                let friendshipRole = null
                if (FriendIds.includes(u.id)) { friendshipRole = 'friend' }
                if (FriendshipInvitationSenderIds.includes(u.id)) { friendshipRole = 'invitationSender' }
                if (FriendshipInvitationRecieverIds.includes(u.id)) { friendshipRole = 'invitationReciever' }

                return { ...u.toJSON(), age, friendshipRole }
            })
            res.render('users/userList', { path: 'userList', users: usersData })
        } catch (err) {
            next(err)
        }
    },
    postFriendshipInvitations: async (req, res, next) => {
        try {
            const { userId } = req.params
            const loginUser = getUser(req)

            const friendshipInvitationRecord = await Friendship_invitation.findOne({
                where: {
                    senderId: loginUser.id,
                    recieverId: Number(userId),
                }
            })
            if (friendshipInvitationRecord) throw new Error('重複發送交友邀請')

            await Friendship_invitation.create({
                senderId: loginUser.id,
                recieverId: Number(userId),
            })

            res.redirect('back')
        } catch (err) {
            next(err)
        }
    },
    deleteFriendshipInvitations: async (req, res, next) => {
        try {
            const { userId } = req.params
            const loginUser = getUser(req)

            const friendshipInvitaionRecord = await Friendship_invitation.findOne({
                where: {
                    [Op.or]: [
                        { senderId: loginUser.id, recieverId: Number(userId) },
                        { senderId: Number(userId), recieverId: loginUser.id }
                    ]
                }
            })

            if (!friendshipInvitaionRecord) throw new Error('交友邀請不存在或已被刪除!')

            await friendshipInvitaionRecord.destroy()
            req.flash('success_messages', '你已刪除交友邀請!')
            res.redirect('back')

        } catch (err) {
            next(err)
        }
    },
    postFriendships: async (req, res, next) => {
        try {
            let { userId } = req.params
            userId = Number(userId)
            const loginUser = getUser(req)

            // 檢查交友邀請是否存在，若不存在則結束處理
            const friendshipInvitaionRecord = await Friendship_invitation.findOne({
                where: { senderId: userId, recieverId: loginUser.id }
            })
            if (!friendshipInvitaionRecord) throw new Error('交友邀請不存在或已被刪除，故無法接受邀請')

            // 檢查朋友關係是否存在，若存在則結束處理
            const friendshipRecord = await Friendship.findOne({
                where: {
                    [Op.or]: [
                        { userId: loginUser.id, friendId: userId },
                        { userId: userId, friendId: loginUser.id }
                    ]
                }
            })
            if (friendshipRecord) throw new Error('朋友關係已存在，無法再次建立關係')

            // 使用transaction保證一併執行「刪除邀請」和「建立朋友關係」，發生錯誤則一併取消
            await sequelize.transaction(async (t) => {
                await friendshipInvitaionRecord.destroy({ transaction: t })
                await Friendship.create(
                    { userId: loginUser.id, friendId: userId },
                    // 加入下面一行避免sequelize試圖在friendId插入null
                    { fields: ["userId", "friendId"] },
                    { transaction: t }
                )
                await Friendship.create(
                    { userId: userId, friendId: loginUser.id },
                    // 加入下面一行避免sequelize試圖在friendId插入null
                    { fields: ["userId", "friendId"] },
                    { transaction: t }
                )
            })

            req.flash('success_messages', '成功建立朋友關係!')
            res.redirect('back')
        } catch (err) {
            next(err)
        }
    },
    deleteFriendships: async (req, res, next) => {
        try {
            const currentUrl = req.headers.referer
            let { userId } = req.params
            userId = Number(userId)
            const loginUser = getUser(req)

            // 檢查朋友關係是否存在，若不存在則結束處理
            const friendshipsRecord = await Friendship.findAll({
                where: {
                    [Op.or]: [
                        { userId: loginUser.id, friendId: userId },
                        { userId: userId, friendId: loginUser.id }
                    ]
                }
            })
            if (!friendshipsRecord) throw new Error('朋友關係已解除，無法再次解除')

            await Friendship.destroy({
                where: {
                    [Op.or]: [
                        { userId: loginUser.id, friendId: userId },
                        { userId: userId, friendId: loginUser.id }
                    ]
                }
            })
            req.flash('success_messages', '解除朋友關係!')
            if (currentUrl.indexOf('/users/loginUser/privateMessages') !== -1) {
                res.redirect('/users/loginUser/privateMessages')
            }
            res.redirect('back')
        } catch (err) {
            next(err)
        }
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
                            { model: Group_message, include: [User] },
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
                        id: groupChatData.id,
                        name: groupChatData.name,
                        latestMessage,
                        chatType: 'groupChat',
                        User: groupChatData.User,
                        RegisteredUsers: groupChatData.RegisteredUsers,
                        Group_messages: groupChatData.Group_messages,
                    }
                }))

                // 將groupChat按日期新->舊排序，沒有訊息的chat置頂
                let chatsWithNoMessage = []
                for (let i = groupChats.length - 1; i >= 0; i = i - 1) {
                    if (groupChats[i].Group_messages.length === 0) {
                        const removed = groupChats.splice(i, 1)
                        chatsWithNoMessage.unshift(...removed)
                    }
                }
                const chatsWithMessage = groupChats.sort((a, b) => new Date(b.latestMessage.createdAt) - new Date(a.latestMessage.createdAt))
                groupChats = chatsWithMessage.concat(chatsWithNoMessage)

            }

            // 選擇要顯示所有訊息的groupChat
            let unfoldedGroupChat
            if (groupId) {
                unfoldedGroupChat = groupChats.find(i => i.id === groupId)
            } else {
                unfoldedGroupChat = groupChats[0]
            }

            res.render('users/userMessages', {
                path: 'getUserGroupMessages',
                chats: groupChats || null,
                unfoldedChat: unfoldedGroupChat || null
            })
        } catch (err) {
            next(err)
        }
    },
    getUserPrivateMessages: async (req, res, next) => {
        try {
            const loginUser = getUser(req)
            const friends = loginUser.Friends
            const userId = req.query ? Number(req.query.userId) : null
            
            let givenFriend
            if (userId) {
                // 檢查朋友關係是否存在，若不存在則結束處理
                givenFriend = friends.filter(friend=> friend.id === userId)
                if (!givenFriend.length) throw new Error('朋友關係不存在或已解除，無法查看對話')
            }

            // 整理左側聊天列表
            const latestPrivateMessges = friends.length? await Promise.all(friends.map(async friend=>{
                const MessageData = await Private_message.findOne({
                    where: {
                        [Op.or]: [
                            { senderId: loginUser.id, recieverId: friend.id },
                            { senderId: friend.id, recieverId: loginUser.id }
                        ]
                    },
                    order: [['createdAt', 'DESC']]
                })
                
                if (MessageData) {
                    // 刪減過長的訊息文字
                    if (MessageData.content && MessageData.content.length > 15) {
                        MessageData.content = MessageData.content.substring(0, 14) + '...'
                    }
                }
                
                const Message = MessageData? { 
                    ...MessageData.toJSON(),
                    User: friend,
                    isLoginUser: (loginUser.id === MessageData.senderId),
                    formattedCreatedAt: formatMessageTime(MessageData.createdAt)
                } : null

                return { 
                    id: friend.id,
                    name: friend.account,
                    avatar: friend.avatar,
                    chatType: 'privateChat',
                    latestMessage: Message
                }
            })) : null
            
            // 若左側聊天列表資料存在，整理右側展開訊息
            let unfoldedPrivateChat
            if (friends.length) {
                const privateMessagesData = await Private_message.findAll({
                    where: {
                        [Op.or]: [
                            { senderId: loginUser.id, recieverId: givenFriend? givenFriend[0].id : latestPrivateMessges[0].id },
                            { senderId: givenFriend? givenFriend[0].id : latestPrivateMessges[0].id, recieverId: loginUser.id }
                        ]
                    },
                    include: [{ model: User, as: 'Sender' }, { model: User, as: 'Reciever' }],
                    raw: true,
                    nest: true
                })
                const Private_messages = privateMessagesData.map(message=> {
                    return {
                        ...message,
                        User: message.Sender,
                        isLoginUser: (loginUser.id === message.senderId),
                        formattedCreatedAt: formatMessageTime(message.createdAt)
                    }
                })

                unfoldedPrivateChat = {
                    id: givenFriend? givenFriend[0].id : latestPrivateMessges[0].id,
                    name: givenFriend? givenFriend[0].account : latestPrivateMessges[0].name,
                    photo: givenFriend? givenFriend[0].avatar : latestPrivateMessges[0].avatar,
                    chatType: 'privateChat',
                    Private_messages: Private_messages.length ? Private_messages: null
                }
            }

            res.render('users/userMessages', {
                path: 'getUserPrivateMessages',
                chats: latestPrivateMessges,
                unfoldedChat: unfoldedPrivateChat || null
            })
            
        } catch (err) {
            next(err)
        }
    },
}

module.exports = userController