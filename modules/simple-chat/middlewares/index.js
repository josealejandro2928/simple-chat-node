module.exports = {
    existChatId(req, res, next) {
        let chatId = req.params.chatId;
        if (!chatId) {
            let error = new Error('Invalid chat request, the chatId does not exist');
            error.sendStatus = 404;
            return next(error);
        }
        global.models.SimpleChat.findById(chatId).then(data => {
            if (!data) {
                let error = new Error('Invalid chat request, the chatId does not exist');
                error.sendStatus = 404;
                return next(error);
            }
            req.chat = data;
            return next();
        }).catch(err => {
            return next(err);
        })

    }
}