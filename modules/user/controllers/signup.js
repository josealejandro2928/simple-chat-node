const valResult = require('express-validator').validationResult;

module.exports = function signUp(req, res, next) {

    const errors = valResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validations fails, entered data is incorrect');
        error.statusCode = 422;
        error.errors = errors.array();
        throw error;
    }
    let code = req.body.code;
    let phone = req.body.phone;
    let name = req.body.name;
    let newUser = new global.models.User({
        name,
        phone,
        countryCode: code
    })
    return newUser.save().then(user => {
        return res.status(201).json({
            data: user
        })
    }).catch(error => {
        return next(error);
    });

}