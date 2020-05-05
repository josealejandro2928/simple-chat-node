const router = require("express").Router();
const enssureAuth = require("../../../middleware/enssureAuth");
const chatMidd = require("../middlewares/index");

module.exports = function registry() {
    const chatCollectionRoute = '/chat';
    router.get(chatCollectionRoute + '/init', enssureAuth, require('../controllers/initChat'));

    router.post(chatCollectionRoute + '/:chatId', enssureAuth, chatMidd.existChatId,
        require("../controllers/create-messagge"));



    ////////////////USING FOR APP/////////////////////
    global.app.express.use(router);
}