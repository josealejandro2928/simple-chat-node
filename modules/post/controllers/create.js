const validationResult = require('express-validator').validationResult;

module.exports = function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validations fails, entered data is incorrect');
        error.statusCode = 422;
        error.errors = errors.array();
        throw error;
    }
    let newPost = new global.models.Post({
        ...req.body,
        creator: {
            name: "Jose ALejandro"
        }
    })
    newPost.save().then((post) => {
        return res.status(201).json({
            data: post
        })
    }).catch((error) => {
        return next(error);
    })
}