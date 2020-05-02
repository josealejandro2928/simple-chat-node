const router = require("express").Router();
const enssureAuth = require("../../../middleware/enssureAuth");

module.exports = function registry() {
    const chatCollectionRoute = '/chat';
    router.get(chatCollectionRoute, enssureAuth, require('../controllers/getChatMessages'));

    router.post(chatCollectionRoute, enssureAuth, require("../controllers/create-messagge"));



    ////////////////USING FOR APP/////////////////////
    global.app.express.use(router);
}