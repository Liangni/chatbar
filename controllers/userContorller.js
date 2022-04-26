const bcrypt = require('bcryptjs')
const { Gender, District, User, Interest, Owned_interest } = require('../models')

const userController = {
    loginPage: (req, res) => {    
        res.render('users/login')
    },
    registerPage: (req, res, next) => {
        Promise.all([
            Gender.findAll({ raw: true }),
            District.findAll({ raw: true })
        ])
        .then(([genders, districts]) => {
            res.render('users/register', { genders, districts }
            )
        })
        .catch(err => next(err))  
    },
    register: (req, res, next) => {
        const { account, password, confirmPassword, genderId, birthday, occupation, districtId, interest } = req.body

        if (!account || !password || !confirmPassword || !genderId || !birthday || !occupation || !districtId || !interest) throw new Error('所有欄位皆為必填!')
        if (password !== confirmPassword) throw new Error('密碼與確認密碼不一致!')

        return User.findOne({ where: { account } })
        .then((userData) => {
            if (userData) throw new Error('重複註冊帳號！')

            return Promise.all([
                bcrypt.hash(password, 10),
                Interest.findOne({ where: { name: interest } })
            ])
        })
        .then(([hash, interestData]) => {
            if (!interestData) { 
                return Promise.all([
                    User.create({
                        account,
                        password: hash,
                        genderId,
                        birthday,
                        occupation,
                        districtId
                    }),
                    Interest.create({ name: interest })
                ])
            }
            return Promise.all([
                User.create({
                    account,
                    password: hash,
                    genderId,
                    birthday,
                    occupation,
                    districtId
                }),
                interestData
            ])
        })
        .then(([newUser, interestData]) => {
            return Owned_interest.create({
                userId: newUser.id,
                interestId: interestData.id
            })
        })
        .then(() =>{
            req.flash('success_messages', '註冊成功!')
            res.redirect('/users/login')
        })
        .catch(err => next(err))
    },
    getUserMessages: (req, res) => {
        res.render('userMessages')
    }
}

module.exports = userController