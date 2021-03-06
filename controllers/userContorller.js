const bcrypt = require('bcryptjs')
const { Op } = require("sequelize")
const dayjs = require('dayjs')
// 若採用JWT驗證，要加入如下
// const jwt = require('jsonwebtoken')
const { Gender, District, User, Interest, Owned_interest, Area, Friendship_invitation, Friendship, sequelize } = require('../models')
const { getUser } = require('../helpers/auth-helpers')
const userServices = require('../services/user-services')
const fileHelpers = require('../helpers/file-helpers')

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
    logIn: async (req, res, next) => {
        try {
            const loginUser = getUser(req)
            const token = await fileHelpers.createFirebaseCustomToken(loginUser.id)
            req.flash('success_messages', '成功登入!')
            res.redirect(`/groupChats?token=${token}`)
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
    getUserMessages: async (req, res, next) => {
        try {
            let userGroupChats = {}
            let userPrivateChats = {}
            let chatsWithNoMessage = []
            let unfoldedChat = null
            await userServices.getUserGroupMessages(req, (err, data) => {
                return err ? next(err) : userGroupChats = data
            })
            
            await userServices.getUserPrivateMessages(req, (err, data) => {
                return err ? next(err) : userPrivateChats = data
            })

            if (userPrivateChats.chats) {
                for (let i = userPrivateChats.chats.length - 1; i >= 0; i = i - 1) {
                    if (!userPrivateChats.chats[i].latestMessage) {
                        const removed = userPrivateChats.chats.splice(i, 1)
                        chatsWithNoMessage.unshift(...removed)
                    }
                }
            }
            if (userGroupChats.chats) {
                for (let i = userGroupChats.chats.length - 1; i >= 0; i = i - 1) {
                    if (!userGroupChats.chats[i].latestMessage) {
                        const removed = userGroupChats.chats.splice(i, 1)
                        chatsWithNoMessage.unshift(...removed)
                    }
                }
            }
            const chatsWithMessage = userPrivateChats.chats ? userPrivateChats.chats.concat(userGroupChats.chats ? userGroupChats.chats : []) : userGroupChats.chats ? userGroupChats.chats : []
            if (chatsWithMessage.length) {
                chatsWithMessage.sort((a, b) => new Date(b.latestMessage.createdAt) - new Date(a.latestMessage.createdAt))
                if (chatsWithMessage[0].chatType === 'groupChat') unfoldedChat = userGroupChats.unfoldedChat
                if (chatsWithMessage[0].chatType === 'privateChat') unfoldedChat = userPrivateChats.unfoldedChat
            }
            
            const chats = chatsWithMessage.concat(chatsWithNoMessage)
           
            res.render('users/userMessages', { 
                path: 'getUserMessages',
                chats: chats.length? chats : null,
                unfoldedChat 
             })
        } catch (err) {
            next(err)
        }

    },
    getUserGroupMessages: async (req, res, next) => {
        try {
            let userGroupChats = {}
            await userServices.getUserGroupMessages(req, (err, data) => {
                return err ? next(err) : userGroupChats = data
            })

            res.render('users/userMessages', {
                path: 'getUserGroupMessages',
                ...userGroupChats
            })
        } catch (err) {
            next(err)
        }
    },
    getUserPrivateMessages: async (req, res, next) => {
        try {
            let userPrivateChats = {}
            await userServices.getUserPrivateMessages(req, (err, data) => {
                return err ? next(err) : userPrivateChats = data
            })

            res.render('users/userMessages', {
                path: 'getUserPrivateMessages',
                ...userPrivateChats
            })
        } catch (err) {
            next(err)
        }
    },
}

module.exports = userController