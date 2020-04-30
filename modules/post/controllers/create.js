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
        creator: req.loggedUser
    })
    console.log("newPost", newPost)
    newPost.save().then((post) => {
        req.post = post;
        return global.models.User.findById({
            _id: req.loggedUser._id
        }).then(user => {
            user.posts.push(post);
            return user.save();
        })
    }).then(async () => {
        let post = await global.models.Post.findById({
            _id: req.post._id
        }).populate('creator')
        return res.status(201).json({
            data: post
        })
    }).catch((error) => {
        console.log("error", error)
        return next(error);
    })
}