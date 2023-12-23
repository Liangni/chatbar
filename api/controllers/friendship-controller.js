const dayjs = require('dayjs')
const { Op } = require('sequelize')

const {
    Friendship_invitation,
    Friendship,
    User,
    Gender,
    District,
    Interest,
    sequelize
} = require('../../models')
const { getUser } = require('../../helpers/auth-helpers')

const friendshipController = {
    postFriendshipInvitations: async (req, res, next) => {
        try {
            const { userId } = req.params
            const loginUser = getUser(req)

            const friendshipInvitationRecord = await Friendship_invitation.findOne({
                where: {
                    senderId: loginUser.id,
                    recieverId: Number(userId)
                }
            })
            if (friendshipInvitationRecord) throw new Error('重複發送交友邀請')

            await Friendship_invitation.create({
                senderId: loginUser.id,
                recieverId: Number(userId)
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
                        { userId, friendId: loginUser.id }
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
                    { fields: ['userId', 'friendId'] },
                    { transaction: t }
                )
                await Friendship.create(
                    { userId, friendId: loginUser.id },
                    // 加入下面一行避免sequelize試圖在friendId插入null
                    { fields: ['userId', 'friendId'] },
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
                        { userId, friendId: loginUser.id }
                    ]
                }
            })
            if (!friendshipsRecord) throw new Error('朋友關係已解除，無法再次解除')

            await Friendship.destroy({
                where: {
                    [Op.or]: [
                        { userId: loginUser.id, friendId: userId },
                        { userId, friendId: loginUser.id }
                    ]
                }
            })
            req.flash('success_messages', '解除朋友關係!')
            if (currentUrl.indexOf('/pages/privateMessages') !== -1) {
                res.redirect('/pages/privateMessages')
            }
            res.redirect('back')
        } catch (err) {
            next(err)
        }
    },
    getFriendshipInvitationSenders: async (req, res, next) => {
        try {
            const loginUser = getUser(req)
            const friendshipInvitations = await Friendship_invitation.findAll({
                where: { recieverId: loginUser.id },
                include: {
                    model: User,
                    include: [Gender, District, { model: Interest, as: 'CurrentInterests' }]
                },
                order: [['createdAt', 'DESC']]
            })
            const friendshipInvitationSenders = friendshipInvitations.map((i) => ({
                ...i.User.toJSON(),
                age: dayjs(new Date()).diff(i.User.birthday, 'year'),
                district: i.User.District.name,
                gender: i.User.Gender.name
            }))

            res.json({
                status: 'success',
                friendshipInvitationSenders
            })
        } catch (err) {
            console.error(err)
            next(err)
        }
    }
}

module.exports = friendshipController
