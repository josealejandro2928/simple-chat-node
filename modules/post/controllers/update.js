const untilsFile = require('../../../utils/file');

module.exports = function update(req, res, next) {
    let post = req.post;

    global.models.Post.updateOne({
        _id: post._id
    }, req.body).then(() => {
        return global.models.Post.findById(post);
    }).then((postUpdated) => {
        // untilsFile.deleteFile(post.image);
        return res.status(200).json({
            data: postUpdated
        })
    }).catch(err => {
        return next(err);
    })

}