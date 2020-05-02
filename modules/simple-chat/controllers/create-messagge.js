const soketIo = require('../../../socket/socket');
module.exports = async function (req, res, next) {
    let chatId = req.body.chatId;
    let userFromId = req.loggedUser._id;
    let message = req.body.message || '';

    try {
        let chat = await global.models.SimpleChat.findById(chatId);
        if (!chat) {
            let error = new Error('The chat does not Exist');
            error.statusCode = 404;
            throw error;
        }
        let usersDestinations = chat.users;
        let messageX = new global.models.Message({
            simpleChat: chatId,
            userFrom: userFromId,
            date: new Date(),
            status: 'unread',
            creator: userFromId,
            message: message,
        })

        messageX.save().then((message) => {
            return global.mongoose.Promise.mapSeries(usersDestinations, (userIdx) => {
                let socket = soketIo.getClient(userIdx);
                if (socket) {
                    socket.emit('send-message', {
                        data: message,
                        action: 'Mensaje created'
                    })
                }
            })
        }).then(() => {
            return res.sendStatus(204);
        })
    } catch (err) {
        return next(err);
    }






}