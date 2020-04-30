const router = require("express").Router();
const expressVal = require("express-validator")

module.exports = function registry() {
    const authCollectionRoute = '/auth'

    router.post(authCollectionRoute + '/signup',
        expressVal.body('name').trim().isLength({
            min: 2
        }).withMessage('Name is required and length grather than 2'),
        expressVal.body('phone').isMobilePhone().withMessage('Enter a valid phone').custom((value) => {
            return global.models.User.findOne({
                phone: value
            }).then((user) => {
                if (user) {
                    return Promise.reject('This mobile phone already exists');
                }
            })
        }).normalizeEmail(),
        expressVal.body('code').notEmpty(),
        require('../controllers/signup'));

    router.post(authCollectionRoute + '/login', expressVal.body('email').trim().isLength({
        min: 1
    }).withMessage('The email is required'), expressVal.body('password').trim().isLength({
        min: 1
    }), require('../controllers/login'));
    // ////////////////USING FOR APP/////////////////////
    global.app.express.use(router);
}