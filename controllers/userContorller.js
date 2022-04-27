const bcrypt = require('bcryptjs')
// 若採用JWT驗證，要加入如下
// const jwt = require('jsonwebtoken')
const { Gender, District, User, Interest, Owned_interest } = require('../models')

const userController = {
    loginPage: (req, res) => {    
        res.render('users/login')
    },
    registerPage: async (req, res, next) => {
        try {
            const genders = await Gender.findAll({ raw: true })
            const districts = await District.findAll({ raw: true })
            res.render('users/register', { genders, districts })
        } catch(err) {
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
        } catch(err) {
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
    getUserMessages: (req, res) => {
        res.render('userMessages')
    }
}

module.exports = userController