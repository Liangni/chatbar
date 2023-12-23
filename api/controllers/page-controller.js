const { Op } = require('sequelize')
const dayjs = require('dayjs')

const {
    Gender,
    District,
    User,
    Interest,
    Area,
    Group_chat
} = require('../../models')
const { getUser } = require('../../helpers/auth-helpers')
const userServices = require('../../services/user-services')

const pageController = {
    loginPage: (req, res) => {
        res.render('users/login')
    },
    registerPage: async (req, res, next) => {
        try {
            const genders = await Gender.findAll({ raw: true })
            const areas = await Area.findAll({ include: District })
            const areasData = areas.map((a) => {
                a.Districts = a.Districts.map((d) => (d.toJSON()))
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
    getUsersPage: async (req, res, next) => {
        try {
            const loginUser = getUser(req)
            const FriendIds = loginUser.Friends.length ? loginUser.Friends.map((f) => f.id) : []
            const FriendshipInvitationSenderIds = loginUser.FriendshipInvitationSenders.length
                ? loginUser.FriendshipInvitationSenders.map((s) => s.id) : []
            const FriendshipInvitationRecieverIds = loginUser.FriendshipInvitationRecievers.length
                ? loginUser.FriendshipInvitationRecievers.map((s) => s.id) : []

            const users = await User.findAll({
                where: { id: { [Op.not]: loginUser.id } },
                include: [Gender, { model: District, include: Area }, { model: Interest, as: 'CurrentInterests' }]
            })
            const usersData = users.map((u) => {
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
    getGroupChatsPage: async (req, res, next) => {
        try {
            const groupChats = await Group_chat.findAll({
                include: [
                    User,
                    { model: User, as: 'RegisteredUsers' }
                ]
            })
            const loginUser = getUser(req)
            const RegisteredGroupIds = loginUser.RegisteredGroups?.map((g) => g.id) || null
            const groupChatData = groupChats.map((groupChat) => {
                const {
                    id, name, User: user, createdAt, RegisteredUsers
                } = groupChat
                return {
                    id,
                    name,
                    user: user.toJSON(),
                    createdAt,
                    numOfRegisters: RegisteredUsers.length,
                    isRegistered: RegisteredGroupIds?.includes(groupChat.id) || false
                }
            })

            res.render('users/groupChats', { groupChats: groupChatData, path: 'getGroupChats' })
        } catch (err) {
            next(err)
        }
    },
    getMessagesPage: async (req, res, next) => {
        try {
            let userGroupChats = {}
            let userPrivateChats = {}
            const chatsWithNoMessage = []
            let unfoldedChat = null
            await userServices.getUserGroupMessages(req, (err, data) => {
                if (err) next(err)
                userGroupChats = data
            })

            await userServices.getUserPrivateMessages(req, (err, data) => {
                if (err) next(err)
                userPrivateChats = data
            })

            if (userPrivateChats.chats) {
                for (let i = userPrivateChats.chats.length - 1; i >= 0; i -= 1) {
                    if (!userPrivateChats.chats[i].latestMessage) {
                        const removed = userPrivateChats.chats.splice(i, 1)
                        chatsWithNoMessage.unshift(...removed)
                    }
                }
            }
            if (userGroupChats.chats) {
                for (let i = userGroupChats.chats.length - 1; i >= 0; i -= 1) {
                    if (!userGroupChats.chats[i].latestMessage) {
                        const removed = userGroupChats.chats.splice(i, 1)
                        chatsWithNoMessage.unshift(...removed)
                    }
                }
            }

            const chatPropertyOfuserGroupChats = userGroupChats.chats || []
            const chatsWithMessage = userPrivateChats.chats?.concat(chatPropertyOfuserGroupChats)
      || chatPropertyOfuserGroupChats

            if (chatsWithMessage.length) {
                chatsWithMessage.sort(
                    (a, b) => new Date(b.latestMessage.createdAt) - new Date(a.latestMessage.createdAt)
                )
                if (chatsWithMessage[0].chatType === 'groupChat') unfoldedChat = userGroupChats.unfoldedChat
                if (chatsWithMessage[0].chatType === 'privateChat') unfoldedChat = userPrivateChats.unfoldedChat
            }

            const chats = chatsWithMessage.concat(chatsWithNoMessage)

            res.render('users/userMessages', {
                path: 'getUserMessages',
                chats: chats.length ? chats : null,
                unfoldedChat
            })
        } catch (err) {
            next(err)
        }
    },
    getGroupMessagesPage: async (req, res, next) => {
        try {
            let userGroupChats = {}
            await userServices.getUserGroupMessages(req, (err, data) => {
                if (err) next(err)
                userGroupChats = data
            })

            res.render('users/userMessages', {
                path: 'getUserGroupMessages',
                ...userGroupChats
            })
        } catch (err) {
            next(err)
        }
    },
    getPrivateMessagesPage: async (req, res, next) => {
        try {
            let userPrivateChats = {}
            await userServices.getUserPrivateMessages(req, (err, data) => {
                if (err) next(err)
                userPrivateChats = data
            })

            res.render('users/userMessages', {
                path: 'getUserPrivateMessages',
                ...userPrivateChats
            })
        } catch (err) {
            next(err)
        }
    }
}

module.exports = pageController
