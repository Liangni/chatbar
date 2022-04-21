const userController = {
    loginPage: (req, res) => {
        res.render('users/login')
    },
    registerPage: (req, res) => {
        res.render('users/register')
    },
    getUserMessages: (req, res) => {
        res.render('userMessages')
    }
}

module.exports = userController