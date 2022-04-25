const { Gender, District } = require('../models')

const userController = {
    loginPage: (req, res) => {    
        res.render('users/login')
    },
    registerPage: (req, res) => {
        Promise.all([
            Gender.findAll({ raw: true }),
            District.findAll({ raw: true })
        ])
        .then(([genders, districts]) => {
            res.render('users/register', { genders, districts }
            )
        })
        .catch(error => console.log(error))  
    },
    getUserMessages: (req, res) => {
        res.render('userMessages')
    }
}

module.exports = userController