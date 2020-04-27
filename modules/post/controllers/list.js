module.exports = function (req, res, next) {
    global.models.Post.find().then((posts) => {
        return res.status(200).json({
            data: posts,
            totalItems: posts.length
        })
    }).catch(err => {
        return next(err);
    })
}