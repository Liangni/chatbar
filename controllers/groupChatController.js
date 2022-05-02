const { Group_chat, Group_register, User } = require('../models')
const { getUser } = require('../helpers/auth-helpers')

const groupChatController = {
    getGroupChats: async (req, res, next) => {
        try {
            const groupChats = await Group_chat.findAll({
                include: [
                    User,
                    { model: User, as:'RegisteredUsers' }
                ],
            })
            const loginUser = getUser(req)
            const RegisteredGroupIds = loginUser.RegisteredGroups?.map(g => g.id) || null
            const groupChatData = groupChats.map(groupChat => {
                const { id, name, User, createdAt, RegisteredUsers } = groupChat
                return {
                    id,
                    name,
                    user: User.toJSON(),
                    createdAt,
                    numOfRegisters: RegisteredUsers.length,
                    isRegistered: RegisteredGroupIds?.includes(groupChat.id) || false
                }
            })
            res.render('users/groupChats', { groupChats: groupChatData, loginUser, path:'getGroupChats' })
        } catch(err) {
            next(err)
        }
    },
    postGroupChats: async (req, res, next) => {
        try {
            const { name } = req.body
            const loginUser = getUser(req)
            if (name.trim() === '') throw new Error('話題名稱不可為空白!')
            const newGroupChat = await Group_chat.create({
                name,
                userId: loginUser.id
            })
            await Group_register.create({
                groupId: newGroupChat.id,
                userId: loginUser.id
            })
            req.flash('success_messages', '成功開啟話題!')
            res.redirect('/groupChats')
        } catch(err) {
            next(err)
        }
    },
    postGroupRegisters: async (req, res, next) => {
        try {
            const { groupId } = req.params
            const loginUser = getUser(req)
            const groupRegister = await Group_register.findOne({ 
                where: {
                    groupId,
                    userId: loginUser.id
                }
            })
            if (groupRegister) throw new Error('使用者已經加入話題!')
            await Group_register.create({
                groupId,
                userId: loginUser.id
            })
            req.flash('success_messages', '成功加入話題!')
            res.redirect('/groupChats')
        } catch (err) {
            next(err)
        }
    },
    deleteGroupRegisters: async (req, res, next) => {
        try {
            const { groupId } = req.params
            const groupRegister =  await Group_register.findOne({
                where: {
                    groupId,
                    userId: getUser(req).id
                }
            })
            if (!groupRegister) throw new Error('你未加入話題或話題不存在!')
            await groupRegister.destroy()
            const groupRegisterCount = await Group_register.count({ where: {groupId} })
            // 如已沒有使用者加入話題，刪除話題
            if (groupRegisterCount === 0) {
                const groupChat = await Group_chat.findByPk(groupId)
                if (groupChat) { groupChat.destroy()}
            }
            req.flash('success_messages', '你已退出話題!')
            res.redirect('back')
        } catch (err) {
            next(err)
        }
    }
}

module.exports = groupChatController