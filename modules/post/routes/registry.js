const router = require("express").Router();
const expressValidator = require("express-validator")
const enssureAuth = require("../../../middleware/enssureAuth");

module.exports = function registry() {
    const feedCollectionRoute = '/post';
    router.get(feedCollectionRoute, enssureAuth, require('../controllers/list'));

    router.post(feedCollectionRoute, expressValidator.body('title').trim().isLength({
        min: 5
    }), expressValidator.body('content').trim().isLength({
        min: 5
    }), enssureAuth, require('../controllers/create'));

    router.get(feedCollectionRoute + '/:postId', enssureAuth, findByIdMidd, require('../controllers/show'));
    router.patch(feedCollectionRoute + '/:postId', enssureAuth, findByIdMidd, require('../controllers/update'));
    router.delete(feedCollectionRoute + '/:postId', enssureAuth, findByIdMidd, require('../controllers/delete'));

    function findByIdMidd(req, res, next) {
        let postId = req.params.postId;
        if (!postId) {
            let error = new Error('Invalid id param');
            error.statusCode = 400;
            throw error;
        }
        global.models.Post.findOne({
            _id: postId
        }).then((post) => {
            if (!post) {
                let error = new Error('Resource not found');
                error.statusCode = 404;
                throw error;
            }
            req.post = post;
            return next();
        }).catch(error => {
            return next(error);
        })
    }

    ////////////////USING FOR APP/////////////////////
    global.app.express.use(router);
}