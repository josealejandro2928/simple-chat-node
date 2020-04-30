const valResult = require('express-validator').validationResult;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = function login(req, res, next) {

    const errors = valResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validations fails, entered data is incorrect');
        error.statusCode = 422;
        error.errors = errors.array();
        throw error;
    }
    let password = req.body.password;
    let email = req.body.email;

    global.models.User.findOne({
        email: email
    }, '-posts').then((user) => {
        if (!user) {
            let error = new Error('User not found');
            error.statusCode = 401;
            throw error;
        }
        if (user.status != 'activated') {
            let error = new Error('This account is not activated property');
            error.statusCode = 401;
            throw error;
        }
        req.user = user;
        return bcrypt.compare(password, user.password);
    }).then(async comparePass => {
        if (!comparePass) {
            let error = new Error('Incorrect Password');
            error.statusCode = 400;
            throw error;
        }
        const token = jwt.sign({
            email: req.user.email,
            userId: req.user._id.toString()
        }, global.config.jwtKey, {
            expiresIn: '1h'
        });
        let user = req.user.toObject();
        delete user.password;

        return res.status(200).json({
            token: token,
            user: user
        });
    }).catch((err) => {
        return next(err);
    })
}