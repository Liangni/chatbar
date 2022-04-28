const { Group_chat, Group_register } = require('../models')
const { getUser } = require('../helpers/auth-helpers')

const groupChatController = {
    getGroupChats: (req, res) => {
        res.render('groupChats')
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
}

module.exports = groupChatController