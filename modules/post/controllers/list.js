module.exports = function (req, res) {
    global.models.Post.find().then((posts) => {
        return res.status(200).json({
            data: posts,
            totalItems: posts.length
        })
    }).catch(err => {
        return res.status(500).json({
            message: err.message,
            errors: []
        })

    })
}