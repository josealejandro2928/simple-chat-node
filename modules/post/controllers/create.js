const validationResult = require('express-validator').validationResult;

module.exports = function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validations fails, entered data is incorrect',
            errors: errors.array()
        })
    }
    const title = req.body.title;
    const message = req.body.message;
    return res.status(201).json({
        data: {
            title: title,
            message: message,
            id: new Date().toISOString(),
            creator: {
                name: "Jose Alejandro"
            },
            createdAt: new Date()
        }
    });
}