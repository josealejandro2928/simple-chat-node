const untilsFile = require('../../../utils/file');

module.exports = function destroy(req, res, next) {

    if (req.loggedUser._id.toString() != req.post.creator.toString()) {
        let error = new Error('You do not have enough permission to delete this post');
        error.statusCode = 403;
        throw error;
    }

    global.models.Post.deleteOne({
        _id: req.post._id
    }).then(() => {
        untilsFile.deleteFile(req.post.image);
        return res.status(200).json({
            data: req.post
        });
    }).catch(err => {
        return next(err);
    })
}