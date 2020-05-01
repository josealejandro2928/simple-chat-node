const valResult = require('express-validator').validationResult;
const jwt = require('jsonwebtoken');

module.exports = async function confirmAccount(req, res, next) {
    const errors = valResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: 'Validations fails, entered data is incorrect',
            errors: errors.array()
        })
    }

    let pin = req.body.pin;
    let email = req.body.email;

    let user = await global.models.User.findOne({
        email: email
    })

    if (!user) {
        let error = new Error('There is not any user with this email');
        error.statusCode = 400;
        return next(error);
    }

    let pinData = await global.models.Pin.findOne({
        user: user,
        pin: pin,
        expiredAt: {
            $gte: Date.now()
        }
    })

    if (!pinData) {
        let error = new Error('Invalid pin data');
        error.statusCode = 400;
        return next(error);
    }

    const token = jwt.sign({
        email: user.email,
        userId: user._id.toString()
    }, global.config.jwtKey);

    global.models.User.updateOne({
        _id: user._id
    }, {
        status: 'enabled'
    }).then(async () => {
        let _user = await global.models.User.findById(user._id);
        await global.models.Pin.deleteMany({
            user: _user
        })
        return res.status(200).json({
            data: user,
            token: token
        })
    }).catch((error) => {
        return next(error);
    })

}