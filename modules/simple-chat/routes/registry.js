const router = require("express").Router();
const enssureAuth = require("../../../middleware/enssureAuth");
const chatMidd = require("../middlewares/index");

module.exports = function registry() {
    const chatCollectionRoute = '/chat';

    router.get(chatCollectionRoute + '/init', enssureAuth, require('../controllers/init-chat'));

    router.get(chatCollectionRoute, enssureAuth, require('../controllers/list-chats'));
    router.get(chatCollectionRoute + '/:chatId', enssureAuth, chatMidd.existChatId, require('../controllers/show-chat'));

    router.post(chatCollectionRoute + '/:chatId', enssureAuth, chatMidd.existChatId,
        require("../controllers/create-message"));

    router.get(chatCollectionRoute + '/:chatId/messages', enssureAuth, chatMidd.existChatId,
        require("../controllers/list-messages"));

    router.post(chatCollectionRoute + '/:chatId/remove-messages', enssureAuth, chatMidd.existChatId,
        require("../controllers/delete-messages"));



    ////////////////USING FOR APP/////////////////////
    global.app.express.use(router);
}