const validationResult = require('express-validator').validationResult;

module.exports = function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validations fails, entered data is incorrect',
            errors: errors.array()
        })
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
        return res.status(500).json({
            message: error.message,
            errors: []
        })
    })
}