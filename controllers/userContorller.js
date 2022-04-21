const userController = {
    loginPage: (req, res) => {
        res.render('users/login')
    },
    registerPage: (req, res) => {
        res.render('users/register')
    }
}

module.exports = userController