const router = require("express").Router();
const expressVal = require("express-validator")
const enssureAuth = require("../../../middleware/enssureAuth");

module.exports = function registry() {
    const authCollectionRoute = '/auth'

    router.post(authCollectionRoute + '/signup',
        expressVal.body('name').trim().isLength({
            min: 2
        }).withMessage('Name is required and length grather than 2'),
        expressVal.body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
        require('../controllers/signup'));

    router.post(authCollectionRoute + '/confirm-account', expressVal.body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
        expressVal.body('pin').trim().isLength({
            min: 5,
            max: 5
        }).withMessage('The pin is invalid'), require('../controllers/confirm-account'));

    router.post(authCollectionRoute + '/resend-pin',
        expressVal.body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
        require('../controllers/resend-pin'));

    ////////////////////////////////////////////////////
    const personCollectionRoute = '/person'

    router.get(personCollectionRoute + '/contacts', enssureAuth, require('../controllers/get-contacts'))
    // ////////////////USING FOR APP/////////////////////
    global.app.express.use(router);
}