const router = require("express").Router();
const expressValidator = require("express-validator")

module.exports = function registry() {
    const feedCollectionRoute = '/post';
    router.get(feedCollectionRoute, require('../controllers/list'));

    router.post(feedCollectionRoute, expressValidator.body('title').trim().isLength({
        min: 5
    }), expressValidator.body('content').trim().isLength({
        min: 5
    }), require('../controllers/create'));

    ////////////////USING FOR APP/////////////////////
    global.app.express.use(router);
}